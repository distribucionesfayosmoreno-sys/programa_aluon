import { useCallback, useEffect, useRef, useState } from 'react';

type LatLng = {
  lat: number;
  lng: number;
};

type PanoPov = {
  heading: number;
  pitch: number;
};

type Props = {
  apiKey: string;
  address: string;
  heading: number | null;
  pitch: number | null;
  onPositionChange: (value: LatLng | null) => void;
  onPovChange: (value: PanoPov) => void;
  onLoadingChange: (value: boolean) => void;
  onError: (message: string | null) => void;
};

type MapsWindow = Window & {
  google?: {
    maps?: {
      importLibrary: (name: string) => Promise<unknown>;
    };
  };
};

type MapsEventListener = {
  remove: () => void;
};

type LatLngHandle = {
  lat: () => number;
  lng: () => number;
};

type PanoramaPovHandle = {
  heading: number;
  pitch: number;
};

type PanoramaHandle = {
  setPosition: (value: LatLng) => void;
  getPosition: () => LatLngHandle | null;
  setPov: (value: PanoPov) => void;
  getPov: () => PanoramaPovHandle;
  addListener: (eventName: string, handler: () => void) => MapsEventListener;
};

type StreetViewLibrary = {
  StreetViewPanorama: new (
    container: HTMLElement,
    options: {
      addressControl?: boolean;
      linksControl?: boolean;
      panControl?: boolean;
      enableCloseButton?: boolean;
      motionTracking?: boolean;
      motionTrackingControl?: boolean;
      position?: LatLng;
      pov?: PanoPov;
      zoom?: number;
      visible?: boolean;
    }
  ) => PanoramaHandle;
};

const GOOGLE_SCRIPT_ID = 'aluon-google-maps-script';

let googleMapsLoadPromise: Promise<MapsWindow['google']> | null = null;

const loadGoogleMaps = async (apiKey: string): Promise<MapsWindow['google']> => {
  const mapsWindow = window as MapsWindow;
  if (mapsWindow.google?.maps) {
    return mapsWindow.google;
  }

  if (!googleMapsLoadPromise) {
    googleMapsLoadPromise = new Promise<MapsWindow['google']>((resolve, reject) => {
      const finish = () => {
        if (mapsWindow.google?.maps) {
          resolve(mapsWindow.google);
          return;
        }
        reject(new Error('Google Maps no disponible'));
      };

      const fail = () => reject(new Error('No se pudo cargar Google Maps'));
    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener('error', fail, { once: true });
      if (mapsWindow.google?.maps) finish();
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = finish;
    script.onerror = fail;
    document.head.appendChild(script);
    });
  }

  try {
    return await googleMapsLoadPromise;
  } catch (error) {
    googleMapsLoadPromise = null;
    throw error;
  }
};

export const GoogleStreetViewExplorer = ({
  apiKey,
  address,
  heading,
  pitch,
  onPositionChange,
  onPovChange,
  onLoadingChange,
  onError,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<PanoramaHandle | null>(null);
  const geocodeRequestRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);

  // Stabilize callbacks via refs to prevent re-init of the panorama
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const onPovChangeRef = useRef(onPovChange);
  onPovChangeRef.current = onPovChange;

  const onLoadingChangeRef = useRef(onLoadingChange);
  onLoadingChangeRef.current = onLoadingChange;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Store initial heading/pitch for panorama creation only
  const initialHeadingRef = useRef(heading);
  const initialPitchRef = useRef(pitch);

  // Initialize the panorama ONCE when apiKey is available
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!apiKey || !containerRef.current) {
        return;
      }
      onLoadingChangeRef.current(true);
      setComponentError(null);
      try {
        const google = await loadGoogleMaps(apiKey);
        if (cancelled || !google?.maps || !containerRef.current) {
          return;
        }

        if (cancelled || !containerRef.current) {
          return;
        }

        const streetViewLib = await google.maps.importLibrary('streetView') as StreetViewLibrary;
        if (cancelled || !containerRef.current) {
          return;
        }

        const panorama = new streetViewLib.StreetViewPanorama(containerRef.current, {
          addressControl: false,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
          motionTracking: false,
          motionTrackingControl: false,
          pov: {
            heading: initialHeadingRef.current ?? 0,
            pitch: initialPitchRef.current ?? 0,
          },
          zoom: 0,
          visible: true,
        });

        panorama.addListener('position_changed', () => {
          const position = panorama.getPosition();
          if (!position) {
            onPositionChangeRef.current(null);
            return;
          }
          onPositionChangeRef.current({ lat: position.lat(), lng: position.lng() });
        });

        panorama.addListener('pov_changed', () => {
          const pov = panorama.getPov();
          onPovChangeRef.current({ heading: pov.heading, pitch: pov.pitch });
        });

        panoramaRef.current = panorama;
        setLoaded(true);
        onErrorRef.current(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo iniciar Street View';
        setComponentError(message);
        onErrorRef.current(message);
      } finally {
        onLoadingChangeRef.current(false);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // Geocode ONLY when address changes
  const geocodeAddress = useCallback((trimmedAddress: string) => {
    const panorama = panoramaRef.current;
    if (!panorama || trimmedAddress.length === 0) {
      return;
    }

    const requestId = ++geocodeRequestRef.current;
    onLoadingChangeRef.current(true);
    void fetch(`/api/door-visual-simulations/geocode?address=${encodeURIComponent(trimmedAddress)}`)
      .then(response => {
        if (!response.ok) throw new Error('No se pudo localizar la dirección');
        return response.json() as Promise<{ latitude: number; longitude: number }>;
      })
      .then(result => {
        if (requestId !== geocodeRequestRef.current) {
          return;
        }
        panorama.setPosition({ lat: result.latitude, lng: result.longitude });
        // Don't override POV here so user doesn't lose orientation if geocode triggers
        onErrorRef.current(null);
      })
      .catch(() => {
        if (requestId !== geocodeRequestRef.current) {
          return;
        }
        onErrorRef.current('No se pudo localizar la dirección en Street View');
      })
      .finally(() => {
        if (requestId === geocodeRequestRef.current) {
          onLoadingChangeRef.current(false);
        }
      });
  }, []);

  useEffect(() => {
    const trimmedAddress = address.trim();
    if (!loaded || trimmedAddress.length < 3) {
      geocodeRequestRef.current += 1;
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      geocodeAddress(trimmedAddress);
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
      geocodeRequestRef.current += 1;
    };
  }, [address, loaded, geocodeAddress]);

  // Handle external heading/pitch changes (like RESET) without geocoding
  useEffect(() => {
    const panorama = panoramaRef.current;
    if (!loaded || !panorama) return;

    const currentPov = panorama.getPov();
    // Only update if difference is significant to avoid rounding loops
    const hDiff = Math.abs(currentPov.heading - (heading ?? 0));
    const pDiff = Math.abs(currentPov.pitch - (pitch ?? 0));
    
    if (hDiff > 0.1 || pDiff > 0.1) {
      panorama.setPov({
        heading: heading ?? 0,
        pitch: pitch ?? 0,
      });
    }
  }, [heading, pitch, loaded]);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-[#edf1f4]">
      {componentError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/95 px-6 text-center">
          <div className="max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-lg">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl">!</div>
            <h2 className="text-base font-black text-slate-900">No se pudo cargar Street View</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Google Maps ha rechazado la clave para este navegador. Puedes continuar usando el snapshot de fachada.</p>
            <p className="mt-3 text-xs font-semibold text-amber-700">Activa Maps JavaScript API y autoriza el origen actual en las restricciones de la clave.</p>
          </div>
        </div>
      )}
    </div>
  );
};
