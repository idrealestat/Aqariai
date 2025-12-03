import { useState } from 'react';
import { Grid, ArrowLeft, Delete } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface StandardCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function StandardCalculator({ onNavigate }: StandardCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        case '=':
          newValue = inputValue;
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const percentage = () => {
    const value = parseFloat(display);
    
    // إذا كانت هناك عملية جارية مع رقم سابق
    if (previousValue !== null && operation && operation !== '=') {
      // احسب النسبة المئوية من الرقم السابق
      const percentValue = (previousValue * value) / 100;
      setDisplay(String(percentValue));
      setWaitingForOperand(true);
    } else {
      // خلاف ذلك، فقط قسم على 100
      setDisplay(String(value / 100));
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const buttons = [
    { label: 'C', className: 'bg-orange-500 hover:bg-orange-600 text-white', action: clear },
    { label: '⌫', className: 'bg-orange-400 hover:bg-orange-500 text-white', action: () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0') },
    { label: '%', className: 'bg-purple-500 hover:bg-purple-600 text-white', action: percentage },
    { label: '÷', className: 'bg-blue-500 hover:bg-blue-600 text-white', action: () => performOperation('÷') },
    
    { label: '7', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('7') },
    { label: '8', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('8') },
    { label: '9', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('9') },
    { label: '×', className: 'bg-blue-500 hover:bg-blue-600 text-white', action: () => performOperation('×') },
    
    { label: '4', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('4') },
    { label: '5', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('5') },
    { label: '6', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('6') },
    { label: '-', className: 'bg-blue-500 hover:bg-blue-600 text-white', action: () => performOperation('-') },
    
    { label: '1', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('1') },
    { label: '2', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('2') },
    { label: '3', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('3') },
    { label: '+', className: 'bg-blue-500 hover:bg-blue-600 text-white', action: () => performOperation('+') },
    
    { label: '±', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: toggleSign },
    { label: '0', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: () => inputDigit('0') },
    { label: '.', className: 'bg-gray-700 hover:bg-gray-600 text-white', action: inputDot },
    { label: '=', className: 'bg-green-500 hover:bg-green-600 text-white', action: () => performOperation('=') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6" dir="ltr">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6" dir="rtl">
          <Button
            onClick={() => onNavigate('quick-calculator')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة
          </Button>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
              <Grid className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-orange-900 mb-2">آلة حاسبة</h1>
            <p className="text-orange-700">حاسبة قياسية للعمليات الحسابية</p>
          </div>
        </div>

        {/* Calculator */}
        <Card className="border-2 border-orange-300 shadow-2xl bg-gray-900">
          <CardContent className="p-6">
            {/* Display */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-gray-700">
              <div className="text-right text-5xl font-bold text-white break-all">
                {display}
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={button.action}
                  className={`h-16 text-2xl font-bold rounded-lg transition-all ${button.className}`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}