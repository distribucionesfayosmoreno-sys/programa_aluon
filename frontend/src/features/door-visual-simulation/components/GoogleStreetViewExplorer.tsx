import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!apiKey || !containerRef.current) {
        return;
      }
      onLoadingChange(true);
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
            heading: heading ?? 0,
            pitch: pitch ?? 0,
          },
          zoom: 0,
          visible: true,
        });

        panorama.addListener('position_changed', () => {
          const position = panorama.getPosition();
          if (!position) {
            onPositionChange(null);
            return;
          }
          onPositionChange({ lat: position.lat(), lng: position.lng() });
        });

        panorama.addListener('pov_changed', () => {
          const pov = panorama.getPov();
          onPovChange({ heading: pov.heading, pitch: pov.pitch });
        });

        panoramaRef.current = panorama;
        setLoaded(true);
        onError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo iniciar Street View';
        onError(message);
      } finally {
        onLoadingChange(false);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [apiKey, heading, onError, onLoadingChange, onPositionChange, onPovChange, pitch]);

  useEffect(() => {
    const panorama = panoramaRef.current;
    const geocoder = geocoderRef.current;
    const trimmedAddress = address.trim();
    if (!loaded || !panorama || !geocoder || trimmedAddress.length === 0) {
      return;
    }

    let cancelled = false;
    onLoadingChange(true);
    void geocoder.geocode({ address: trimmedAddress })
      .then(result => {
        if (cancelled || result.results.length === 0) {
          return;
        }
        const location = result.results[0].geometry.location;
        panorama.setPosition({ lat: location.lat(), lng: location.lng() });
        panorama.setPov({
          heading: heading ?? 0,
          pitch: pitch ?? 0,
        });
        onError(null);
      })
      .catch(() => {
        if (!cancelled) {
          onError('No se pudo localizar la dirección en Street View');
        }
      })
      .finally(() => {
        if (!cancelled) {
          onLoadingChange(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [address, heading, loaded, onError, onLoadingChange, pitch]);

  return <div ref={containerRef} className="h-full w-full bg-[#edf1f4]" />;
};
