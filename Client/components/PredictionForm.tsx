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
  exit: { opacity: 0, scale: 0.95 },
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border-2 text-slate-100
            ${error ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'}
          `}
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
        <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <Switch.Label className="text-sm font-medium text-slate-200">
                {label}
              </Switch.Label>
              {description && (
                <p className="text-xs text-slate-500">{description}</p>
              )}
            </div>

            <Switch
              checked={checked}
              onChange={onChange}
              className={`relative inline-flex h-6 w-11 rounded-full transition
                ${checked ? 'bg-cyan-500' : 'bg-slate-600'}`}
            >
              <motion.span
                layout
                transition={{
                  type: 'spring' as const,
                  stiffness: 500,
                  damping: 30,
                }}
                className={`inline-block h-4 w-4 bg-white rounded-full transform
                  ${checked ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </Switch>
          </div>
        </div>
      </Switch.Group>
    </motion.div>
  );
}

/* -------------------- Main Form -------------------- */

export function PredictionForm() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
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
      toast.success('Risk assessment completed!');
    },
  });

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6"
    >
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <motion.div variants={containerVariants} className="space-y-6">

          <AnimatedInput
            label="Age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
            required
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

          <motion.button
            type="submit"
            disabled={mutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            {mutation.isPending ? 'Calculating...' : 'Calculate Risk'}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-300"
          >
            <RotateCcw className="inline h-4 w-4 mr-2" />
            Reset
          </motion.button>

        </motion.div>
      </form>
    </motion.div>
  );
}
