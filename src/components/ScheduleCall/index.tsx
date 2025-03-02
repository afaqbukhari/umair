import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isToday } from 'date-fns';
import TimeSlot from './TimeSlot';
import { googleCalendarService } from './GoogleCalendarService';

type ScheduleCallProps = {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date, time: string, details: BookingDetails) => void;
  darkMode?: boolean;
};

export type BookingDetails = {
  name: string;
  email: string;
  purpose: string;
};

type Step = 'date' | 'time' | 'details' | 'confirmation' | 'error';

const ScheduleCall: React.FC<ScheduleCallProps> = ({ 
  isOpen, 
  onClose, 
  onSchedule,
  darkMode = false
}) => {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    name: '',
    email: '',
    purpose: ''
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [calendarEvents, setCalendarEvents] = useState<Record<string, boolean>>({});

  // Generate days for the current week view
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Initialize Google Calendar service
  useEffect(() => {
    googleCalendarService.initialize();
    googleCalendarService.authenticate();
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('date');
      setSelectedDate(null);
      setSelectedTime(null);
      setBookingDetails({
        name: '',
        email: '',
        purpose: ''
      });
      setErrorMessage('');
    }
  }, [isOpen]);

  // Fetch events for the current week
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const startDate = currentWeekStart;
        const endDate = addDays(currentWeekStart, 7);
        const events = await googleCalendarService.getEvents(startDate, endDate);
        
        // Create a map of dates with events
        const eventMap: Record<string, boolean> = {};
        events.forEach(event => {
          const eventDate = new Date(event.start.dateTime);
          const dateKey = format(eventDate, 'yyyy-MM-dd');
          eventMap[dateKey] = true;
        });
        
        setCalendarEvents(eventMap);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    
    fetchEvents();
  }, [currentWeekStart]);

  // When a date is selected, fetch available time slots
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    try {
      const availableSlots = await googleCalendarService.getAvailableTimeSlots(date);
      setAvailableTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableTimeSlots([]);
      setErrorMessage('Failed to retrieve available time slots. Please try again.');
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const event = await googleCalendarService.createEvent(
        selectedDate, 
        selectedTime, 
        60, 
        bookingDetails
      );
      
      onSchedule(selectedDate, selectedTime, bookingDetails);
      setStep('confirmation');
    } catch (error) {
      console.error('Error scheduling call:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to schedule call. Please try again.');
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleBack = () => {
    if (step === 'time') setStep('date');
    else if (step === 'details') setStep('time');
    else if (step === 'error') setStep('details');
  };

  const handleRetry = () => {
    setStep('details');
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      >
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div 
            className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
          >
            <div className="flex items-center gap-2">
              <Calendar className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} size={20} />
              <h2 className="text-xl font-semibold">Schedule a Call</h2>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6">
            {/* Steps indicator */}
            <div className="flex items-center justify-center mb-8">
              {['date', 'time', 'details', 'confirmation'].map((s, i) => (
                <React.Fragment key={s}>
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step === s || (step === 'error' && s === 'details')
                        ? darkMode 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-600 text-white'
                        : i < ['date', 'time', 'details', 'confirmation'].indexOf(step === 'error' ? 'details' : step)
                          ? darkMode
                            ? 'bg-indigo-900 text-indigo-300'
                            : 'bg-indigo-100 text-indigo-600'
                          : darkMode
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 3 && (
                    <div 
                      className={`w-12 h-1 ${
                        i < ['date', 'time', 'details'].indexOf(step === 'error' ? 'details' : step)
                          ? darkMode
                            ? 'bg-indigo-900'
                            : 'bg-indigo-100'
                          : darkMode
                            ? 'bg-gray-800'
                            : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Content based on step */}
            {step === 'date' && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Select a Date
                </h3>
                
                {/* Week navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={handlePrevWeek}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-medium">
                    {format(currentWeekStart, 'MMMM yyyy')}
                  </span>
                  <button 
                    onClick={handleNextWeek}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {/* Day names */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div 
                      key={day} 
                      className="text-center text-sm font-medium py-2"
                    >
                      {day}
                    </div>
                  ))}
                  
                  {/* Days */}
                  {weekDays.map((day) => {
                    const formattedDate = format(day, 'yyyy-MM-dd');
                    const hasEvents = calendarEvents[formattedDate];
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                    const isSelectable = !isPast;
                    
                    return (
                      <button
                        key={formattedDate}
                        onClick={() => isSelectable && handleDateSelect(day)}
                        disabled={!isSelectable}
                        className={`
                          relative flex flex-col items-center justify-center p-4 rounded-lg
                          ${isToday(day) ? darkMode ? 'border border-indigo-500' : 'border border-indigo-500' : ''}
                          ${
                            isSelectable 
                              ? darkMode 
                                ? 'bg-gray-800 hover:bg-gray-700 cursor-pointer' 
                                : 'bg-white hover:bg-gray-50 shadow-sm cursor-pointer'
                              : darkMode
                                ? 'bg-gray-900 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        <span className={`text-lg ${isToday(day) ? 'font-bold' : ''}`}>
                          {format(day, 'd')}
                        </span>
                        <span className="text-xs mt-1">
                          {format(day, 'EEE')}
                        </span>
                        
                        {/* Indicator for events */}
                        {hasEvents && (
                          <span 
                            className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${
                              darkMode ? 'bg-indigo-400' : 'bg-indigo-600'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  Select a date to see available time slots
                </p>
              </div>
            )}
            
            {step === 'time' && (
              <div>
                <div className="flex items-center mb-4">
                  <button 
                    onClick={handleBack}
                    className={`p-2 mr-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-lg font-medium">
                    Select a Time for {selectedDate && format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((time) => (
                      <div key={time}>
                        <TimeSlot
                          time={time}
                          selected={time === selectedTime}
                          onClick={() => handleTimeSelect(time)}
                          darkMode={darkMode}
                        />
                      </div>
                    ))
                  ) : (
                    <p className={`col-span-3 text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No available time slots for this date.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {step === 'details' && (
              <div>
                <div className="flex items-center mb-4">
                  <button 
                    onClick={handleBack}
                    className={`p-2 mr-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-lg font-medium">
                    Your Details
                  </h3>
                </div>
                
                <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={18} />
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={18} />
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor="name" 
                        className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={bookingDetails.name}
                        onChange={handleDetailsChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                        } focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="email" 
                        className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={bookingDetails.email}
                        onChange={handleDetailsChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                        } focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="purpose" 
                        className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Meeting Purpose
                      </label>
                      <textarea
                        id="purpose"
                        name="purpose"
                        value={bookingDetails.purpose}
                        onChange={handleDetailsChange}
                        required
                        rows={3}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                        } focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className={`w-full py-3 px-4 rounded-lg font-medium ${
                        darkMode
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      } flex items-center justify-center`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Schedule Call'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
      {step === 'error' && (
  <div className="text-center py-8">
    <div
      className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
        darkMode ? 'bg-red-900/30' : 'bg-red-100'
      }`}
    >
      <AlertCircle size={40} className="text-red-600" />
    </div>
    
    <h3 className="text-2xl font-bold mb-2">
      Booking Failed
    </h3>
    <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {errorMessage || 'Something went wrong while scheduling your call. Please try again.'}
    </p>
    
    <div className="flex justify-center gap-4">
      <button
        onClick={handleRetry}
        className={`py-2 px-4 rounded-lg font-medium ${
          darkMode
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        Try Again
      </button>
      <button
        onClick={onClose}
        className={`py-2 px-4 rounded-lg font-medium ${
          darkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
        }`}
      >
        Cancel
      </button>
    </div>
  </div>
)}

{step === 'confirmation' && (
  <div className="text-center py-8">
    <div
      className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
        darkMode ? 'bg-green-900/30' : 'bg-green-100'
      }`}
    >
      <Check size={40} className="text-green-600" />
    </div>
    
    <h3 className="text-2xl font-bold mb-2">
      Call Scheduled!
    </h3>
    <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      Your call has been successfully scheduled for{' '}
      {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}.
      You’ll receive a confirmation email shortly.
    </p>
    
    <button
      onClick={onClose}
      className={`py-2 px-4 rounded-lg font-medium ${
        darkMode
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      Done
    </button>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCall;
