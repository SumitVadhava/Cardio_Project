// src/components/PredictionForm.tsx

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch, Transition, Dialog } from '@headlessui/react';
import { PredictionFormData, predictionSchema } from '../lib/validations';
import { api } from '../lib/api';
import { 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  Heart, 
  Stethoscope,
  X,
  Activity,
  User,
  Gauge,
  ShieldAlert,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PredictionResult } from '../types';
import { RiskGauge } from './charts/RiskGauge';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.95 }
};

// Custom Input Component with animations
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

function AnimatedInput({ label, type = 'text', step, error, helpText, required, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Omit the conflicting `onDrag`, `onDragEnd`, `onAnimationStart`, and `onDragStart` properties
  const { onDrag, onDragEnd, onAnimationStart, onDragStart, ...restProps } = props;

  return (
    <motion.div variants={itemVariants} className="relative">
      <label className="block text-sm font-semibold text-text-secondary mb-2">
        {label}
        {required && <span className="text-purple-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <motion.input
          type={type}
          step={step}
          {...restProps}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={
            `w-full px-4 py-3 bg-background-card border-2 rounded-xl
              text-text-primary placeholder:text-text-muted
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-0 shadow-sm
            ${error 
                ? 'border-red-400 focus:border-red-500 bg-error/10' 
                : 'border-border focus:border-primary hover:border-primary'
            }`
          }
          whileFocus={{ scale: 1.01 }}
        />
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {error}
            </motion.p>
          ) : helpText ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-1.5 text-xs text-text-muted"
            >
              {helpText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Custom Select Component
interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

function AnimatedSelect({ label, options, error, required, ...props }: AnimatedSelectProps) {
  return (
    <motion.div variants={itemVariants}>
      <label className="block text-sm font-semibold text-text-secondary mb-2">
        {label}
        {required && <span className="text-purple-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className={`
          w-full px-4 py-3 bg-background-card border-2 rounded-xl
          text-text-primary appearance-none cursor-pointer shadow-sm
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-red-400 focus:border-red-500 bg-error/10' 
            : 'border-border focus:border-primary hover:border-primary'
          }
        `}
        style={{
          // Updated SVG color to purple (%239333ea) to match theme
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239333ea'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background-card text-text-primary">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

// Custom Switch Component
interface AnimatedSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function AnimatedSwitch({ label, description, checked, onChange }: AnimatedSwitchProps) {
  return (
    <motion.div variants={itemVariants}>
      <Switch.Group>
        <div 
          className={`
            p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer shadow-sm
            ${checked 
              ? 'bg-accent/10 border-accent/20' 
              : 'bg-background-card border-border hover:border-border-light'
            }
          `}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <Switch.Label className="text-sm font-semibold text-text-primary cursor-pointer">
                {label}
              </Switch.Label>
              {description && (
                <Switch.Description className="text-xs text-text-muted mt-0.5">
                  {description}
                </Switch.Description>
              )}
            </div>
            <Switch
              checked={checked}
              onChange={onChange}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-300 ease-out focus:outline-none
                focus:ring-2 focus:ring-accent/50 focus:ring-offset-2
                ${checked ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-background-hover'}
              `}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-accent shadow-md
                  ${checked ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </Switch>
          </div>
        </div>
      </Switch.Group>
    </motion.div>
  );
}

// Section Header Component
interface SectionHeaderProps {
  number: number;
  title: string;
  icon: React.ReactNode;
}

function SectionHeader({ number, title, icon }: SectionHeaderProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className="flex items-center gap-3 mb-5"
    >
      <motion.div 
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-sm"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className="text-sm font-bold">{number}</span>
      </motion.div>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
    </motion.div>
  );
}

// Result Modal Component
interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PredictionResult | null;
}

function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-background-card border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="relative px-6 py-5 bg-background-card border-b border-border">
                  <Dialog.Title className="text-xl font-bold text-text-primary flex items-center gap-3">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="p-2 bg-accent/10 rounded-xl"
                    >
                      <Activity className="h-5 w-5 text-accent" />
                    </motion.div>
                    Risk Assessment Result
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-hover transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                {result && (
                  <motion.div 
                    className="p-6 space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    {/* Risk Gauge */}
                    <motion.div variants={itemVariants} className="py-4">
                      {/* Assuming RiskGauge supports light mode or we wrap it. 
                          If RiskGauge has internal dark styles, they need to be updated in that component separately. 
                      */}
                      <RiskGauge score={result.riskScore} level={result.riskLevel} />
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                      {[
                        { 
                          value: `${result.riskScore}%`, 
                          label: '10-Year Risk',
                          color: 'text-accent',
                          bgColor: 'bg-accent/10'
                        },
                        { 
                          value: result.riskLevel, 
                          label: 'Risk Level',
                          color: result.riskLevel === 'low' ? 'text-emerald-400' :
                                 result.riskLevel === 'medium' ? 'text-amber-400' : 'text-rose-400',
                          bgColor: result.riskLevel === 'low' ? 'bg-emerald-900/8' :
                                   result.riskLevel === 'medium' ? 'bg-amber-900/8' : 'bg-rose-900/8'
                        },
                        { 
                          value: result.modelVersion, 
                          label: 'Model Version',
                          color: 'text-blue-400',
                          bgColor: 'bg-blue-900/8'
                        },
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          className={`p-4 rounded-xl border border-transparent ${stat.bgColor} text-center`}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className={`text-2xl font-bold capitalize ${stat.color}`}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-text-secondary font-medium mt-1">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <motion.div 
                        variants={itemVariants}
                        className="p-5 bg-background-hover rounded-xl border-l-4 border-accent/30"
                      >
                        <h4 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 text-sm text-text-secondary font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {rec}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Risk Factors */}
                    {result.factors && result.factors.length > 0 && (
                      <motion.div variants={itemVariants}>
                        <h4 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5 text-accent" />
                          Contributing Risk Factors
                        </h4>
                        <div className="space-y-3">
                          {result.factors.map((factor, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-4 bg-background-card rounded-xl border border-border shadow-sm border-l-4 border-l-accent/20"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-text-primary">{factor.name}</span>
                                <span className={`text-sm font-bold ${
                                  factor.impact > 20 ? 'text-rose-400' :
                                  factor.impact > 10 ? 'text-amber-400' : 'text-emerald-400'
                                }`}>
                                  +{factor.impact}%
                                </span>
                              </div>
                              <p className="text-xs text-text-muted mb-2">{factor.description}</p>
                              <div className="h-1.5 bg-background-hover rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(factor.impact * 3, 100)}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                                  className={`h-full rounded-full ${
                                    factor.impact > 20 ? 'bg-rose-400' :
                                    factor.impact > 10 ? 'bg-amber-400' : 'bg-emerald-400'
                                  }`}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Close Button */}
                    <motion.button
                      variants={itemVariants}
                      onClick={onClose}
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl
                        hover:from-primary-hover hover:to-secondary transition-all duration-300 shadow-lg shadow-accent/20
                        focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2
                        flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Heart className="h-5 w-5" />
                      Close & Start New Assessment
                    </motion.button>
                  </motion.div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Main PredictionForm Component
export function PredictionForm() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<PredictionFormData>({ 
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      gender: 'male',
      smoking: false,
      diabetes: false,
      familyHistory: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PredictionFormData) => api.createPrediction(data),
    onSuccess: (data) => {
      setResult(data);
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Risk assessment completed!', {
          icon: '🎯',
          style: {
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '12px',
          },
      });
    },
    onError: (error: Error) => {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction. Check connection.', {
        style: {
          background: 'linear-gradient(180deg, rgba(255,0,0,0.06), rgba(255,0,0,0.04))',
          color: 'var(--text-primary)',
          border: '1px solid rgba(255,0,0,0.08)',
          borderRadius: '12px',
        },
      });
    },
  });

  const onSubmit = (data: PredictionFormData) => {
    mutation.mutate(data);
  };

  const handleCloseModal = () => {
    setShowResult(false);
    reset();
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-background-card rounded-2xl border border-border shadow-xl shadow-black/40 overflow-hidden"
      >
        {/* Form Header */}
        <div className="relative px-6 py-8 bg-background-card border-b border-border">
          {/* subtle dotted background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          
          <motion.div 
            className="relative flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="p-3 bg-background-hover rounded-xl border border-border shadow-sm"
              whileHover={{ scale: 1.03, rotate: 3 }}
            >
              <Stethoscope className="h-7 w-7 text-accent" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Risk Assessment</h2>
              <p className="text-text-muted text-sm mt-1 font-medium">
                Enter patient information to calculate cardiovascular risk
              </p>
            </div>
          </motion.div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Basic Information Section */}
            <div>
              <SectionHeader 
                number={1} 
                title="Basic Information" 
                icon={<User className="h-4 w-4 text-purple-400" />}
              />
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <AnimatedInput
                  label="Age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  error={errors.age?.message}
                  helpText="Patient's age in years (18-120)"
                  required
                />
                <AnimatedSelect
                  label="Gender"
                  {...register('gender')}
                  error={errors.gender?.message}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  required
                />
              </motion.div>
            </div>

            {/* Clinical Measurements Section */}
            <div>
              <SectionHeader 
                number={2} 
                title="Clinical Measurements" 
                icon={<Gauge className="h-4 w-4 text-purple-400" />}
              />
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <AnimatedInput
                  label="Total Cholesterol"
                  type="number"
                  {...register('cholesterol', { valueAsNumber: true })}
                  error={errors.cholesterol?.message}
                  helpText="mg/dL (Normal: <200)"
                  required
                />
                <AnimatedInput
                  label="Systolic BP"
                  type="number"
                  {...register('bloodPressureSystolic', { valueAsNumber: true })}
                  error={errors.bloodPressureSystolic?.message}
                  helpText="mmHg (Normal: <120)"
                  required
                />
                <AnimatedInput
                  label="Diastolic BP"
                  type="number"
                  {...register('bloodPressureDiastolic', { valueAsNumber: true })}
                  error={errors.bloodPressureDiastolic?.message}
                  helpText="mmHg (Normal: <80)"
                  required
                />
                <AnimatedInput
                  label="BMI"
                  type="number"
                  step="0.1"
                  {...register('bmi', { valueAsNumber: true })}
                  error={errors.bmi?.message}
                  helpText="kg/m² (Normal: 18.5-24.9)"
                />
              </motion.div>
            </div>

            {/* Risk Factors Section */}
            <div>
              <SectionHeader 
                number={3} 
                title="Risk Factors" 
                icon={<ShieldAlert className="h-4 w-4 text-purple-400" />}
              />
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Controller
                  name="smoking"
                  control={control}
                  render={({ field }) => (
                    <AnimatedSwitch
                      label="Smoker"
                      description="Current or former smoker"
                      checked={field.value ?? false}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="diabetes"
                  control={control}
                  render={({ field }) => (
                    <AnimatedSwitch
                      label="Diabetes"
                      description="Type 1 or Type 2 diabetes"
                      checked={field.value ?? false}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="familyHistory"
                  control={control}
                  render={({ field }) => (
                    <AnimatedSwitch
                      label="Family History"
                      description="CVD in first-degree relatives"
                      checked={field.value ?? false}
                      onChange={field.onChange}
                    />
                  )}
                />
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border"
            >
              <motion.button
                type="button"
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-background-card text-text-secondary font-semibold rounded-xl
                  border-2 border-border hover:border-border-light hover:bg-background-hover transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-border"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset Form
              </motion.button>
              <motion.button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                  bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl
                  hover:from-primary-hover hover:to-secondary transition-all duration-300 shadow-lg shadow-accent/20
                  focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
              >
                {mutation.isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Activity className="h-5 w-5" />
                    </motion.div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-5 w-5" />
                    Calculate Risk Score
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResult}
        onClose={handleCloseModal}
        result={result}
      />
    </>
  );
}