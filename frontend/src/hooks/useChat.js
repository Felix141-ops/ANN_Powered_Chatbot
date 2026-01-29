import { useState } from "react";

const questions = [
  { key: "pregnancies", text: "How many times have you been pregnant?" },
  { key: "glucose", text: "What is your glucose level?" },
  { key: "blood_pressure", text: "What is your blood pressure?" },
  { key: "skin_thickness", text: "What is your skin thickness value?" },
  { key: "insulin", text: "What is your insulin level?" },
  { key: "bmi", text: "What is your BMI?" },
  { key: "dpf", text: "What is your diabetes pedigree function (DPF)?" },
  { key: "age", text: "What is your age?" }
];

export const useChat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: questions[0].text }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleUserInput = (input) => {
    const key = questions[currentStep].key;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input }
    ]);

    setAnswers((prev) => ({ ...prev, [key]: input }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: questions[currentStep + 1].text }
      ]);
    }
  };

  return { messages, handleUserInput, answers, currentStep };
};
