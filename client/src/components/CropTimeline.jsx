import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Droplets, Leaf, Shield, Crop, Search, Info } from 'lucide-react';
import { cropsAPI, schedulesAPI } from '../utils/api';
import { taskTypeConfig } from '../utils/helpers';

function TaskItem({ task, isToday }) {
  const config = taskTypeConfig[task.type] || taskTypeConfig.monitoring;
  return (
    <div className={`relative pl-10 pb-6 timeline-item`}>
      {/* Icon dot */}
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${config.color} border-2 ${config.borderColor} flex items-center justify-center text-sm z-10 bg-white`}>
        {config.icon}
      </div>

      {/* Card */}
      <div className={`rounded-xl border p-3.5 ${isToday ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-white'} ${task.priority === 'high' ? 'ring-1 ring-red-200' : ''}`}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <p className="text-sm font-semibold text-gray-900">{task.title}</p>
            {task.titleHindi && (
              <p className="text-xs text-emerald-700 font-medium">{task.titleHindi}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Day {task.day}</span>
            {task.priority === 'high' && (
              <span className="badge bg-red-100 text-red-700 text-[9px]">⚡ Critical</span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>
        <div className="mt-2">
          <span className={`badge text-[9px] ${config.color}`}>{config.label}</span>
        </div>
      </div>
    </div>
  );
}

function StageSection({ stage }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 rounded-xl mb-3 transition-colors hover:opacity-90"
        style={{ backgroundColor: stage.color + '33', borderLeft: `4px solid ${stage.color}` }}
      >
        <div>
          <p className="text-sm font-bold text-gray-800">{stage.stageName}</p>
          <p className="text-xs text-gray-600">{stage.stageNameHindi} • Day {stage.startDay}–{stage.endDay}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-white/70 text-gray-700 text-[10px]">{stage.tasks?.length || 0} tasks</span>
          <ChevronDown size={16} className={`text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && stage.tasks?.length > 0 && (
        <div className="ml-2">
          {stage.tasks.map((task, i) => (
            <TaskItem key={i} task={task} isToday={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CropTimeline({ initialCrop = null }) {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropsLoading, setCropsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const { data } = await cropsAPI.getAll();
        setCrops(data.data || []);
        if (!initialCrop && data.data?.length > 0) {
          setSelectedCrop(data.data[0]);
        }
      } catch {
        setCrops([]);
      } finally {
        setCropsLoading(false);
      }
    };
    fetchCrops();
  }, []);

  useEffect(() => {
    if (initialCrop) setSelectedCrop(initialCrop);
  }, [initialCrop]);

  useEffect(() => {
    if (!selectedCrop) return;
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const { data } = await schedulesAPI.getByCropName(selectedCrop.name);
        setSchedule(data.data?.[0] || null);
      } catch {
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedCrop]);

  const typeFilters = ['all', 'irrigation', 'fertilizer', 'pesticide', 'harvest', 'sowing'];

  const filteredSchedule = schedule ? {
    ...schedule,
    stages: schedule.stages.map(stage => ({
      ...stage,
      tasks: activeFilter === 'all'
        ? stage.tasks
        : stage.tasks.filter(t => t.type === activeFilter),
    })).filter(stage => stage.tasks.length > 0),
  } : null;

  return (
    <div className="card">
      <div className="p-5 border-b border-gray-100">
        <h3 className="section-title mb-1">
          <span>📅</span> Crop Timeline & Task Scheduler
        </h3>
        <p className="text-xs text-gray-500">Day-wise schedule for irrigation, fertilizer & pest control</p>
      </div>

      {/* Crop Selector */}
      <div className="p-5 pb-3">
        <label className="block text-xs font-medium text-gray-600 mb-2">Select Crop</label>
        {cropsLoading ? (
          <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {crops.map(crop => (
              <button
                key={crop._id}
                onClick={() => setSelectedCrop(crop)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCrop?._id === crop._id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {crop.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task Type Filter */}
      {schedule && (
        <div className="px-5 pb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {typeFilters.map(filter => {
              const config = filter === 'all' ? null : taskTypeConfig[filter];
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {config ? config.icon : '📋'}
                  {filter === 'all' ? 'All Tasks' : config?.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Content */}
      <div className="px-5 pb-5">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-12 bg-gray-200 rounded-xl mb-3" />
                <div className="space-y-2 ml-2">
                  <div className="h-16 bg-gray-100 rounded-xl" />
                  <div className="h-16 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : !schedule ? (
          <div className="py-8 text-center">
            <p className="text-gray-400 text-sm">
              {selectedCrop
                ? `No schedule found for ${selectedCrop.name}. Make sure seed data is loaded.`
                : 'Select a crop to view its schedule.'}
            </p>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-2xl">🌾</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{schedule.cropName}</p>
                <p className="text-xs text-gray-600">Total Duration: {schedule.totalDays} days • {schedule.stages.length} growth stages</p>
              </div>
            </div>

            {/* Stages */}
            {filteredSchedule?.stages.map((stage, i) => (
              <StageSection key={i} stage={stage} />
            ))}

            {filteredSchedule?.stages.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-6">
                No {activeFilter} tasks found. Select "All Tasks" to see the full schedule.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
