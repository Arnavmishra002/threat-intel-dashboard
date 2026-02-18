import React from 'react';
import { ShieldAlert, CheckCircle, Activity, Globe, Clock, MousePointer } from 'lucide-react';
import type { SessionData } from '../../types/data';

interface SessionDetailModalProps {
    session: SessionData | null;
    onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => {
    if (!session) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${session.is_bot === 1 ? 'bg-red-100' : 'bg-green-100'}`}>
                                {session.is_bot === 1 ? (
                                    <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
                                ) : (
                                    <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                                )}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                    Session Analysis #{session.is_bot === 1 ? 'SUSPICIOUS' : 'NORMAL'}
                                </h3>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            <Activity className="w-4 h-4 mr-1" /> Anomaly Score
                                        </div>
                                        <div className={`text-xl font-bold ${session.is_bot === 1 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {session.is_bot === 1 ? 'High Risk' : 'Low Risk'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            <Globe className="w-4 h-4 mr-1" /> Traffic Source
                                        </div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                                            {session.traffic_source}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            <Clock className="w-4 h-4 mr-1" /> Duration
                                        </div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                                            {session.session_duration.toFixed(2)}s
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            <MousePointer className="w-4 h-4 mr-1" /> Click Rate
                                        </div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                                            {session.clicks_per_second.toFixed(2)} /s
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Full Session Data</h4>
                                    <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto max-h-48 text-xs font-mono text-gray-600 dark:text-gray-300">
                                        <pre>{JSON.stringify(session, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close Analysis
                        </button>
                        {session.is_bot === 1 && (
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Flag as False Positive
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
