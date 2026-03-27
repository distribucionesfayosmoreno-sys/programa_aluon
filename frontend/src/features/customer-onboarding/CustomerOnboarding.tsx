import { CustomerOnboardingCatalog } from './CustomerOnboardingCatalog';
import { CustomerOnboardingConfirmation } from './CustomerOnboardingConfirmation';
import { CustomerOnboardingHeader } from './CustomerOnboardingHeader';
import { CustomerOnboardingMeasurements } from './CustomerOnboardingMeasurements';
import { CustomerOnboardingRegistration } from './CustomerOnboardingRegistration';
import { CustomerOnboardingSent } from './CustomerOnboardingSent';
import { CustomerOnboardingSummary } from './CustomerOnboardingSummary';
import { CustomerOnboardingType } from './CustomerOnboardingType';
import { useCustomerOnboarding } from './useCustomerOnboarding';

const CustomerOnboarding = () => {
  const {
    step,
    registration,
    registrationResponse,
    selectedModelCard,
    selectedTypeCard,
    widthMm,
    heightMm,
    items,
    channel,
    quote,
    error,
    submitting,
    statusLoading,
    m2,
    handleRegistrationChange,
    registerCustomer,
    refreshRegistrationStatus,
    addItem,
    finalizeQuote,
    refreshQuoteStatus,
    syncQuoteStatus,
    handleNewProduct,
    handleModelSelection,
    handleTypeSelection,
    setWidthMm,
    setHeightMm,
    setChannel,
    setStep,
    resetQuoteFlow,
    setError,
  } = useCustomerOnboarding();

  const handleManageOrder = () => {
    setError('Funcionalidad de gestión en preparación.');
  };

  return (
    <div className="flex flex-col gap-6">
      <CustomerOnboardingHeader error={error} />

      {step === 'REGISTRO' && (
        <CustomerOnboardingRegistration
          registration={registration}
          onChange={handleRegistrationChange}
          onSubmit={registerCustomer}
          submitting={submitting}
        />
      )}

      {step === 'CONFIRMADO' && registrationResponse && (
        <CustomerOnboardingConfirmation
          registrationResponse={registrationResponse}
          submitting={submitting}
          onRequestQuote={() => setStep('CATALOGO')}
          onManageOrder={handleManageOrder}
          onRefreshStatus={refreshRegistrationStatus}
          onRestart={() => setStep('REGISTRO')}
        />
      )}

      {step === 'CATALOGO' && (
        <CustomerOnboardingCatalog onSelectModel={handleModelSelection} />
      )}

      {step === 'TIPO' && selectedModelCard && (
        <CustomerOnboardingType
          selectedModelCard={selectedModelCard}
          onSelectType={handleTypeSelection}
          onBack={() => setStep('CATALOGO')}
        />
      )}

      {step === 'MEDIDAS' && selectedModelCard && selectedTypeCard && (
        <CustomerOnboardingMeasurements
          selectedModelCard={selectedModelCard}
          selectedTypeCard={selectedTypeCard}
          widthMm={widthMm}
          heightMm={heightMm}
          m2={m2}
          onWidthChange={setWidthMm}
          onHeightChange={setHeightMm}
          onAddItem={addItem}
          onAddOtherType={handleNewProduct}
          onBack={() => setStep('TIPO')}
        />
      )}

      {step === 'RESUMEN' && (
        <CustomerOnboardingSummary
          items={items}
          channel={channel}
          submitting={submitting}
          onAddProduct={handleNewProduct}
          onSelectChannel={setChannel}
          onFinalize={finalizeQuote}
          onBackToCatalog={() => setStep('CATALOGO')}
        />
      )}

      {step === 'ENVIADO' && quote && (
        <CustomerOnboardingSent
          quote={quote}
          statusLoading={statusLoading}
          onNewQuote={resetQuoteFlow}
          onRefresh={refreshQuoteStatus}
          onSync={syncQuoteStatus}
          onBack={() => setStep('CONFIRMADO')}
        />
      )}
    </div>
  );
};

export default CustomerOnboarding;
