import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import useQuery from './useQuery';

export default function useStep(numberStepProps) {
  // debugger;
  const query = useQuery();
  const history = useHistory();
  const [curentStep, setCurentStep] = useState(() => {
    const stepKey = +query.get('step');
    return stepKey || 1;
  });
  const [isNextStep, setIsNextStep] = useState(true);
  const [isPrevStep, setIsPrevStep] = useState(false);
  const [numberStep, setNumberStep] = useState(numberStepProps);
  const [firstRender, setFirstRender] = useState(false);

  useEffect(() => {
    const enumTab = Array.from({ length: numberStepProps }, (_, i) => i + 1);
    const stepKey = +query.get('step');

    if (stepKey && enumTab.includes(stepKey)) {
      jumpStep(stepKey);
    }

    setFirstRender(true);
  }, []);

  function nextStep() {
    if (curentStep < numberStep) setCurentStep(curentStep + 1);
  }

  function prevStep() {
    if (curentStep > 1) setCurentStep(curentStep - 1);
  }

  function jumpStep(number) {
    if (typeof numberStep !== 'number') return;
    if (number > numberStep) {
      setCurentStep(numberStep);
    } else {
      setCurentStep(number);
    }
  }

  function updateNewNumberStep(value) {
    setNumberStep(10);
  }

  useEffect(() => {
    if (curentStep) {
      history.push(`${history.location.pathname}?step=${curentStep}`);
    }

    if (curentStep === 1) {
      setIsPrevStep(false);
    } else {
      setIsPrevStep(true);
    }

    if (curentStep === numberStep) {
      setIsNextStep(false);
    } else {
      setIsNextStep(true);
    }
  }, [curentStep]);

  useEffect(() => {
    if (firstRender) {
      setCurentStep(1);
      setIsNextStep(true);
      setIsPrevStep(false);
    }
  }, [numberStep]);

  if (typeof numberStep !== 'number')
    return new Error('numberStep type number !');

  return {
    curentStep,
    prevStep,
    nextStep,
    jumpStep,
    isNextStep,
    isPrevStep,
    updateNewNumberStep,
  };
}
