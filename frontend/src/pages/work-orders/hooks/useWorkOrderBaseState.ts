import { useState } from 'react';
import { MODELS, MOCK_REQUESTS } from '../constants';
import type { TabKey, WorkOrderRequest } from '../models';

export const useWorkOrderBaseState = () => {
  const [requests, setRequests] = useState<WorkOrderRequest[]>(MOCK_REQUESTS);
  const [customerId, setCustomerId] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [modelReference, setModelReference] = useState('');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [m2, setM2] = useState(0);
  const [googleView, setGoogleView] = useState(false);
  const [notes, setNotes] = useState('');

  const [developmentGenerated, setDevelopmentGenerated] = useState(false);

  const [prodCut, setProdCut] = useState(false);
  const [prodFab, setProdFab] = useState(false);
  const [prodLac, setProdLac] = useState(false);
  const [prodLacControl, setProdLacControl] = useState(false);

  const [finalized, setFinalized] = useState(false);
  const [ready, setReady] = useState<'PICKUP' | 'SHIPPING' | ''>('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('INBOX');

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);

  return {
    requests,
    setRequests,
    customerId,
    setCustomerId,
    modelId,
    setModelId,
    modelReference,
    setModelReference,
    modelImage,
    setModelImage,
    m2,
    setM2,
    googleView,
    setGoogleView,
    notes,
    setNotes,
    developmentGenerated,
    setDevelopmentGenerated,
    prodCut,
    setProdCut,
    prodFab,
    setProdFab,
    prodLac,
    setProdLac,
    prodLacControl,
    setProdLacControl,
    finalized,
    setFinalized,
    ready,
    setReady,
    selectedRequestId,
    setSelectedRequestId,
    tab,
    setTab,
    showRequestModal,
    setShowRequestModal,
    showWorkOrderModal,
    setShowWorkOrderModal,
  };
};

export type UseWorkOrderBaseStateResult = ReturnType<typeof useWorkOrderBaseState>;
