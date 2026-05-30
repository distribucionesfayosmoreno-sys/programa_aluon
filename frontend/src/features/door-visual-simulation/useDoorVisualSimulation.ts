import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DoorSimulationJobStatus, DoorVisualSimulationActions, DoorVisualSimulationViewState, MaskRect } from './DoorVisualSimulation.types';
import { createDoorSimulationJob, getDoorSimulationFrontendConfig, getDoorSimulationStatus, startDoorSimulationInpaint } from './doorVisualSimulationApi';

const clampInt = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, Math.round(value)));

const validateMaskRect = (rect: MaskRect, imageWidth: number, imageHeight: number): MaskRect => {
  const x = clampInt(rect.x, 0, imageWidth - 1);
  const y = clampInt(rect.y, 0, imageHeight - 1);
  const width = clampInt(rect.width, 1, imageWidth - x);
  const height = clampInt(rect.height, 1, imageHeight - y);
  return { x, y, width, height };
};

export const useDoorVisualSimulation = (): { state: DoorVisualSimulationViewState; actions: DoorVisualSimulationActions } => {
  const [address, setAddress] = useState('');
  const [imageSize, setImageSize] = useState<'640x640' | '512x512'>('640x640');
  const [fov, setFov] = useState(90);
  const [heading, setHeading] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapsJavaScriptApiKey, setMapsJavaScriptApiKey] = useState<string | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [baseImageWidth, setBaseImageWidth] = useState<number | null>(null);
  const [baseImageHeight, setBaseImageHeight] = useState<number | null>(null);
  const [maskRect, setMaskRect] = useState<MaskRect | null>(null);
  const [status, setStatus] = useState<DoorSimulationJobStatus | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollTimer = useRef<number | null>(null);
  const pollDelayMs = useRef(1500);
  const stopped = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollTimer.current != null) {
      window.clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getDoorSimulationFrontendConfig()
      .then(config => {
        if (!cancelled) {
          setMapsJavaScriptApiKey(config.mapsJavaScriptApiKey || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMapsJavaScriptApiKey(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopped.current = true;
      stopPolling();
    };
  }, [stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setError(null);
    setProcessing(false);
    setJobId(null);
    setBaseImageUrl(null);
    setBaseImageWidth(null);
    setBaseImageHeight(null);
    setMaskRect(null);
    setStatus(null);
    setResultImageUrl(null);
    pollDelayMs.current = 1500;
    setImageSize('640x640');
    setFov(90);
    setHeading(null);
    setPitch(null);
    setLatitude(null);
    setLongitude(null);
    setViewerLoading(false);
  }, [stopPolling]);

  const loadBaseImage = useCallback(async () => {
    stopPolling();
    setError(null);
    setProcessing(true);
    setResultImageUrl(null);
    setMaskRect(null);
    setStatus(null);
    try {
      const resp = await createDoorSimulationJob({
        address: address.trim(),
        imageSize,
        fov,
        heading,
        pitch,
        latitude,
        longitude,
      });
      setJobId(resp.jobId);
      setBaseImageUrl(resp.baseImageUrl);
      setBaseImageWidth(resp.imageWidth);
      setBaseImageHeight(resp.imageHeight);
      setStatus(resp.status);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido';
      setError(message);
    } finally {
      setProcessing(false);
    }
  }, [address, fov, heading, imageSize, latitude, longitude, pitch, stopPolling]);

  const pollOnce = useCallback(async (id: string) => {
    try {
      const res = await getDoorSimulationStatus(id);
      setStatus(res.status);
      setBaseImageUrl(res.baseImageUrl);
      setResultImageUrl(res.resultImageUrl);
      if (res.status === 'DONE') {
        setProcessing(false);
        stopPolling();
        return;
      }
      if (res.status === 'FAILED') {
        setProcessing(false);
        stopPolling();
        setError(res.errorMessage || 'Falló la simulación');
        return;
      }

      pollDelayMs.current = Math.min(5000, Math.round(pollDelayMs.current * 1.25));
      pollTimer.current = window.setTimeout(() => {
        if (stopped.current) return;
        void pollOnce(id);
      }, pollDelayMs.current);
    } catch (e) {
      setProcessing(false);
      stopPolling();
      const message = e instanceof Error ? e.message : 'Error consultando el estado';
      setError(message);
    }
  }, [stopPolling]);

  const startInpaint = useCallback(async () => {
    if (!jobId) {
      setError('Primero carga una fachada');
      return;
    }
    if (!maskRect) {
      setError('Selecciona el rectángulo de la puerta');
      return;
    }
    if (!baseImageWidth || !baseImageHeight) {
      setError('Dimensiones de la imagen base no disponibles');
      return;
    }
    stopPolling();
    setError(null);
    setProcessing(true);
    setResultImageUrl(null);

    try {
      const safeRect = validateMaskRect(maskRect, baseImageWidth, baseImageHeight);
      const resp = await startDoorSimulationInpaint(jobId, {
        maskRect: safeRect,
        prompt: prompt.trim() || undefined,
        negativePrompt: negativePrompt.trim() || undefined,
      });
      setStatus(resp.status);
      pollDelayMs.current = resp.pollAfterMs;
      pollTimer.current = window.setTimeout(() => {
        if (stopped.current) return;
        void pollOnce(jobId);
      }, pollDelayMs.current);
    } catch (e) {
      setProcessing(false);
      const message = e instanceof Error ? e.message : 'Error iniciando el inpainting';
      setError(message);
    }
  }, [baseImageHeight, baseImageWidth, jobId, maskRect, negativePrompt, pollOnce, prompt, stopPolling]);

  const state = useMemo<DoorVisualSimulationViewState>(() => ({
    address,
    imageSize,
    fov,
    heading,
    pitch,
    latitude,
    longitude,
    mapsJavaScriptApiKey,
    viewerLoading,
    prompt,
    negativePrompt,
    jobId,
    baseImageUrl,
    baseImageWidth,
    baseImageHeight,
    maskRect,
    status,
    processing,
    resultImageUrl,
    error,
  }), [address, baseImageHeight, baseImageUrl, baseImageWidth, error, fov, heading, imageSize, jobId, latitude, longitude, mapsJavaScriptApiKey, maskRect, negativePrompt, pitch, processing, prompt, resultImageUrl, status, viewerLoading]);

  const actions = useMemo<DoorVisualSimulationActions>(() => ({
    setAddress,
    setImageSize,
    setFov,
    setHeading,
    setPitch,
    setCoordinates: (nextLatitude: number | null, nextLongitude: number | null) => {
      setLatitude(nextLatitude);
      setLongitude(nextLongitude);
    },
    setViewerLoading,
    setErrorMessage: setError,
    setPrompt,
    setNegativePrompt,
    setMaskRect,
    loadBaseImage,
    startInpaint,
    reset,
  }), [loadBaseImage, reset, startInpaint]);

  return { state, actions };
};
