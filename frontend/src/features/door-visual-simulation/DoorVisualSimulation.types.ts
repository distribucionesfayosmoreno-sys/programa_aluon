export type DoorSimulationJobStatus = 'AWAITING_MASK' | 'PROCESSING' | 'DONE' | 'FAILED';

export type CreateDoorSimulationRequest = {
  address: string;
  imageSize?: '640x640' | '512x512';
  fov?: number;
  heading?: number | null;
  pitch?: number | null;
};

export type CreateDoorSimulationResponse = {
  jobId: string;
  status: DoorSimulationJobStatus;
  baseImageUrl: string;
  imageWidth: number;
  imageHeight: number;
};

export type MaskRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StartInpaintRequest = {
  maskRect: MaskRect;
  prompt?: string;
  negativePrompt?: string;
};

export type StartInpaintResponse = {
  jobId: string;
  status: DoorSimulationJobStatus;
  pollAfterMs: number;
};

export type DoorSimulationStatusResponse = {
  jobId: string;
  status: DoorSimulationJobStatus;
  baseImageUrl: string | null;
  resultImageUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DoorVisualSimulationViewState = {
  address: string;
  prompt: string;
  negativePrompt: string;
  jobId: string | null;
  baseImageUrl: string | null;
  baseImageWidth: number | null;
  baseImageHeight: number | null;
  maskRect: MaskRect | null;
  status: DoorSimulationJobStatus | null;
  processing: boolean;
  resultImageUrl: string | null;
  error: string | null;
};

export type DoorVisualSimulationActions = {
  setAddress: (value: string) => void;
  setPrompt: (value: string) => void;
  setNegativePrompt: (value: string) => void;
  setMaskRect: (value: MaskRect | null) => void;
  loadBaseImage: () => Promise<void>;
  startInpaint: () => Promise<void>;
  reset: () => void;
};

