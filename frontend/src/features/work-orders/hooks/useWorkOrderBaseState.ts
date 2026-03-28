import { useCallback, useEffect, useReducer } from 'react';
import { MODELS } from '../constants';
import { fetchWorkOrderRequests } from '../services/requestsApi';
import type { TabKey, WorkOrderRequest } from '../models';

type WorkOrderBaseState = {
  requests: WorkOrderRequest[];
  customerId: string;
  modelId: string;
  modelReference: string;
  modelImage: File | null;
  m2: number;
  googleView: boolean;
  notes: string;
  developmentGenerated: boolean;
  prodCut: boolean;
  prodFab: boolean;
  prodLac: boolean;
  prodLacControl: boolean;
  finalized: boolean;
  ready: 'PICKUP' | 'SHIPPING' | '';
  selectedRequestId: string | null;
  tab: TabKey;
  showRequestModal: boolean;
  showWorkOrderModal: boolean;
};

type WorkOrderBaseAction<K extends keyof WorkOrderBaseState = keyof WorkOrderBaseState> =
  | {
      type: 'SET_FIELD';
      field: K;
      value: WorkOrderBaseState[K];
    }
  | {
      type: 'SET_REQUESTS';
      value: WorkOrderRequest[] | ((prev: WorkOrderRequest[]) => WorkOrderRequest[]);
    };

const initialState: WorkOrderBaseState = {
  requests: [],
  customerId: '',
  modelId: MODELS[0].id,
  modelReference: '',
  modelImage: null,
  m2: 0,
  googleView: false,
  notes: '',
  developmentGenerated: false,
  prodCut: false,
  prodFab: false,
  prodLac: false,
  prodLacControl: false,
  finalized: false,
  ready: '',
  selectedRequestId: null,
  tab: 'INBOX',
  showRequestModal: false,
  showWorkOrderModal: false,
};

const reducer = (state: WorkOrderBaseState, action: WorkOrderBaseAction) => {
  if (action.type === 'SET_FIELD') {
    if (state[action.field] === action.value) {
      return state;
    }
    return { ...state, [action.field]: action.value };
  }
  if (action.type === 'SET_REQUESTS') {
    const nextValue = typeof action.value === 'function' ? action.value(state.requests) : action.value;
    if (state.requests === nextValue) {
      return state;
    }
    return { ...state, requests: nextValue };
  }
  return state;
};

export const useWorkOrderBaseState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const requests = await fetchWorkOrderRequests();
        if (active) {
          dispatch({ type: 'SET_REQUESTS', value: requests });
        }
      } catch (error) {
        console.error('[work-orders] Failed to load requests', error);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const setField = useCallback(
    <K extends keyof WorkOrderBaseState>(field: K, value: WorkOrderBaseState[K]) => {
      dispatch({ type: 'SET_FIELD', field, value });
    },
    [],
  );

  return {
    requests: state.requests,
    setRequests: (value: WorkOrderRequest[] | ((prev: WorkOrderRequest[]) => WorkOrderRequest[])) => {
      dispatch({ type: 'SET_REQUESTS', value });
    },
    customerId: state.customerId,
    setCustomerId: (value: string) => setField('customerId', value),
    modelId: state.modelId,
    setModelId: (value: string) => setField('modelId', value),
    modelReference: state.modelReference,
    setModelReference: (value: string) => setField('modelReference', value),
    modelImage: state.modelImage,
    setModelImage: (value: File | null) => setField('modelImage', value),
    m2: state.m2,
    setM2: (value: number) => setField('m2', value),
    googleView: state.googleView,
    setGoogleView: (value: boolean) => setField('googleView', value),
    notes: state.notes,
    setNotes: (value: string) => setField('notes', value),
    developmentGenerated: state.developmentGenerated,
    setDevelopmentGenerated: (value: boolean) => setField('developmentGenerated', value),
    prodCut: state.prodCut,
    setProdCut: (value: boolean) => setField('prodCut', value),
    prodFab: state.prodFab,
    setProdFab: (value: boolean) => setField('prodFab', value),
    prodLac: state.prodLac,
    setProdLac: (value: boolean) => setField('prodLac', value),
    prodLacControl: state.prodLacControl,
    setProdLacControl: (value: boolean) => setField('prodLacControl', value),
    finalized: state.finalized,
    setFinalized: (value: boolean) => setField('finalized', value),
    ready: state.ready,
    setReady: (value: 'PICKUP' | 'SHIPPING' | '') => setField('ready', value),
    selectedRequestId: state.selectedRequestId,
    setSelectedRequestId: (value: string | null) => setField('selectedRequestId', value),
    tab: state.tab,
    setTab: (value: TabKey) => setField('tab', value),
    showRequestModal: state.showRequestModal,
    setShowRequestModal: (value: boolean) => setField('showRequestModal', value),
    showWorkOrderModal: state.showWorkOrderModal,
    setShowWorkOrderModal: (value: boolean) => setField('showWorkOrderModal', value),
  };
};

export type UseWorkOrderBaseStateResult = ReturnType<typeof useWorkOrderBaseState>;
