import type { DoorModel, DoorType } from './models';

export const formatDoorType = (value: DoorType) => (
  {
    PEATONAL: 'Peatonal',
    ABATIBLE_UNA: 'Abatible 1 hoja',
    ABATIBLE_DOS: 'Abatible 2 hojas',
    CORREDERA: 'Corredera',
    VALLA: 'Valla',
  }[value]
);

export const formatDoorModel = (value: DoorModel) => (
  {
    PREMIUM: 'ALUON Premium',
    CLASSIC: 'ALUON Classic',
    INOX: 'ALUON Inox',
    VENECIANA: 'ALUON Veneciana',
  }[value]
);
