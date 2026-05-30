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

type GeocoderHandle = {
  geocode: (request: { address: string }) => Promise<{
    results: Array<{
      geometry: {
        location: LatLngHandle;
      };
    }>;
  }>;
};

type GeocodingLibrary = {
  Geocoder: new () => GeocoderHandle;
};

const GOOGLE_SCRIPT_ID = 'aluon-google-maps-script';

const loadGoogleMaps = async (apiKey: string): Promise<MapsWindow['google']> => {
  const mapsWindow = window as MapsWindow;
  if (mapsWindow.google?.maps) {
    return mapsWindow.google;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('No se pudo cargar Google Maps')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps'));
    document.head.appendChild(script);
  });

  if (!mapsWindow.google?.maps) {
    throw new Error('Google Maps no disponible');
  }
  return mapsWindow.google;
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
  const geocoderRef = useRef<GeocoderHandle | null>(null);
  const [loaded, setLoaded] = useState(false);

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
      try {
        const google = await loadGoogleMaps(apiKey);
        if (cancelled || !google?.maps || !containerRef.current) {
          return;
        }

        const streetViewLib = await google.maps.importLibrary('streetView') as StreetViewLibrary;
        const geocodingLib = await google.maps.importLibrary('geocoding') as GeocodingLibrary;
        if (cancelled || !containerRef.current) {
          return;
        }

        geocoderRef.current = new geocodingLib.Geocoder();
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
    const geocoder = geocoderRef.current;
    if (!panorama || !geocoder || trimmedAddress.length === 0) {
      return;
    }

    onLoadingChangeRef.current(true);
    void geocoder.geocode({ address: trimmedAddress })
      .then(result => {
        if (result.results.length === 0) {
          return;
        }
        const location = result.results[0].geometry.location;
        panorama.setPosition({ lat: location.lat(), lng: location.lng() });
        // Don't override POV here so user doesn't lose orientation if geocode triggers
        onErrorRef.current(null);
      })
      .catch(() => {
        onErrorRef.current('No se pudo localizar la dirección en Street View');
      })
      .finally(() => {
        onLoadingChangeRef.current(false);
      });
  }, []);

  useEffect(() => {
    const trimmedAddress = address.trim();
    if (!loaded || trimmedAddress.length === 0) {
      return;
    }
    geocodeAddress(trimmedAddress);
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

  return <div ref={containerRef} className="h-full w-full bg-[#edf1f4]" />;
};
