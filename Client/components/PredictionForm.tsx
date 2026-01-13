'use client';

import { useState, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch, Transition, Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
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
  RotateCcw,
} from 'lucide-react';

import { PredictionFormData, predictionSchema } from '../lib/validations';
import { api } from '../lib/api';
import { PredictionResult } from '../types';
import { RiskGauge } from './charts/RiskGauge';

/* -------------------- Animations -------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

/* -------------------- Inputs -------------------- */

interface AnimatedInputProps {
  label: string;
  type?: string;
  step?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  [key: string]: any;
}

function AnimatedInput({
  label,
  type = 'text',
  step,
  error,
  helpText,
  required,
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div variants={itemVariants}>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <motion.input
          {...props}
          type={type}
          step={step}
          whileFocus={{ scale: 1.01 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl
            ${error ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'}
            text-slate-100 transition-all duration-300 focus:outline-none focus:ring-0`}
        />

        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-xs text-rose-400 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}

      {!error && helpText && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}
    </motion.div>
  );
}

/* -------------------- Select -------------------- */

interface AnimatedSelectProps {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  [key: string]: any;
}

function AnimatedSelect({ 
  label, 
  options, 
  error, 
  required, 
  ...props 
}: AnimatedSelectProps) {
  return (
    <motion.div variants={itemVariants}>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </label>
      <select
        {...props}
        className={`
          w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl
          text-slate-100 appearance-none cursor-pointer
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-rose-500/50 focus:border-rose-500' 
            : 'border-slate-700 focus:border-cyan-500 hover:border-slate-600'
          }
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-rose-400 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

/* -------------------- Switch -------------------- */

interface AnimatedSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function AnimatedSwitch({
  label,
  description,
  checked,
  onChange,
}: AnimatedSwitchProps) {
  return (
    <motion.div variants={itemVariants}>
      <Switch.Group>
        <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/40">
          <div className="flex items-center justify-between">
            <div>
              <Switch.Label className="text-sm font-medium text-slate-200">
                {label}
              </Switch.Label>
              {description && (
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              )}
            </div>

            <Switch
              checked={checked}
              onChange={onChange}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors
                ${checked ? 'bg-cyan-500' : 'bg-slate-600'}`}
            >
              <motion.span
                layout
                transition={{
                  type: 'spring' as const,
                  stiffness: 500,
                  damping: 30,
                }}
                className={`inline-block h-4 w-4 my-1 bg-white rounded-full transition-transform
                  ${checked ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </Switch>
          </div>
        </div>
      </Switch.Group>
    </motion.div>
  );
}

/* -------------------- Section Header -------------------- */

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
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className="text-sm font-bold text-cyan-400">{number}</span>
      </motion.div>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
    </motion.div>
  );
}

/* -------------------- Result Modal -------------------- */

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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/50 shadow-2xl transition-all">
                {/* Header */}
                <div className="relative px-6 py-5 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-blue-500/10 border-b border-slate-700/50">
                  <Dialog.Title className="text-xl font-bold text-slate-100 flex items-center gap-3">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="p-2 bg-cyan-500/20 rounded-xl"
                    >
                      <Activity className="h-5 w-5 text-cyan-400" />
                    </motion.div>
                    Risk Assessment Result
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
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
                      <RiskGauge score={result.riskScore} level={result.riskLevel} />
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                      {[
                        { 
                          value: `${result.riskScore}%`, 
                          label: '10-Year Risk',
                          color: 'text-cyan-400'
                        },
                        { 
                          value: result.riskLevel, 
                          label: 'Risk Level',
                          color: result.riskLevel === 'low' ? 'text-emerald-400' :
                                 result.riskLevel === 'medium' ? 'text-amber-400' : 'text-rose-400'
                        },
                        { 
                          value: result.modelVersion, 
                          label: 'Model Version',
                          color: 'text-blue-400'
                        },
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center"
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className={`text-2xl font-bold capitalize ${stat.color}`}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <motion.div 
                        variants={itemVariants}
                        className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/20"
                      >
                        <h4 className="text-base font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 text-sm text-slate-300"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                              {rec}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Risk Factors */}
                    {result.factors && result.factors.length > 0 && (
                      <motion.div variants={itemVariants}>
                        <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5 text-amber-400" />
                          Contributing Risk Factors
                        </h4>
                        <div className="space-y-3">
                          {result.factors.map((factor, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-200">{factor.name}</span>
                                <span className={`text-sm font-bold ${
                                  factor.impact > 20 ? 'text-rose-400' :
                                  factor.impact > 10 ? 'text-amber-400' : 'text-emerald-400'
                                }`}>
                                  +{factor.impact}%
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mb-2">{factor.description}</p>
                              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(factor.impact * 3, 100)}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                                  className={`h-full rounded-full ${
                                    factor.impact > 20 ? 'bg-rose-500' :
                                    factor.impact > 10 ? 'bg-amber-500' : 'bg-emerald-500'
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
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl
                        hover:from-cyan-400 hover:to-blue-400 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
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

/* -------------------- Main Component -------------------- */

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
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
          borderRadius: '12px',
        },
      });
    },
    onError: (error: Error) => {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction. Please check if the backend is running.', {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
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
        className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        {/* Form Header */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-cyan-500/10 via-slate-900/50 to-blue-500/10 border-b border-slate-700/50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <motion.div 
            className="relative flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Stethoscope className="h-7 w-7 text-cyan-400" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Risk Assessment</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Enter patient information to calculate cardiovascular risk
              </p>
            </div>
          </motion.div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
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
                icon={<User className="h-4 w-4 text-slate-500" />}
              />
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                icon={<Gauge className="h-4 w-4 text-slate-500" />}
              />
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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
                icon={<ShieldAlert className="h-4 w-4 text-slate-500" />}
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
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-700/50"
            >
              <motion.button
                type="button"
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl
                  border border-slate-700 hover:bg-slate-700 hover:text-slate-100 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-slate-500/50"
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
                  bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl
                  hover:from-cyan-400 hover:to-blue-400 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
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

