import { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface City {
    name: string;
    timezone: string;
}

const commonCities: City[] = [
    // North America
    { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'Toronto', timezone: 'America/Toronto' },
    { name: 'Mexico City', timezone: 'America/Mexico_City' },
    // South America
    { name: 'Sao Paulo', timezone: 'America/Sao_Paulo' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
    // Europe
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Paris', timezone: 'Europe/Paris' },
    { name: 'Berlin', timezone: 'Europe/Berlin' },
    { name: 'Moscow', timezone: 'Europe/Moscow' },
    { name: 'Kyiv', timezone: 'Europe/Kyiv' },
    // Africa
    { name: 'Cairo', timezone: 'Africa/Cairo' },
    { name: 'Johannesburg', timezone: 'Africa/Johannesburg' },
    // Asia
    { name: 'Dubai', timezone: 'Asia/Dubai' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok' },
    { name: 'Singapore', timezone: 'Asia/Singapore' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Seoul', timezone: 'Asia/Seoul' },
    // Oceania
    { name: 'Sydney', timezone: 'Australia/Sydney' },
    { name: 'Auckland', timezone: 'Pacific/Auckland' },
    // UTC
    { name: 'UTC', timezone: 'UTC' }
];

export default function WorldClockPro() {
    const [time, setTime] = useState(new Date());
    const [selectedCities, setSelectedCities] = useState<City[]>([
        { name: 'Local Time', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { name: 'New York', timezone: 'America/New_York' },
        { name: 'London', timezone: 'Europe/London' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleCity = (city: City) => {
        if (selectedCities.find(c => c.name === city.name)) {
            setSelectedCities(selectedCities.filter(c => c.name !== city.name));
        } else {
            setSelectedCities([...selectedCities, city]);
        }
    };

    const removeCity = (cityName: string) => {
        setSelectedCities(selectedCities.filter(c => c.name !== cityName));
    };

    const Clock = ({ city }: { city: City }) => {
        // Create date object shifted to the target timezone
        const tzString = time.toLocaleString('en-US', { timeZone: city.timezone });
        const localTime = new Date(tzString);

        const secondsRatio = localTime.getSeconds() / 60;
        const minutesRatio = (secondsRatio + localTime.getMinutes()) / 60;
        const hoursRatio = (minutesRatio + localTime.getHours()) / 12;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center relative w-full transition-transform hover:scale-[1.02]">
                <button
                    onClick={() => removeCity(city.name)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition-colors z-20"
                    title="Remove Clock"
                    aria-label="Remove Clock"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative w-40 h-40 mb-5 mt-2">
                    {/* Clock Face */}
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 shadow-inner">
                        {/* Markers */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className={`absolute left-1/2 origin-bottom transform -translate-x-1/2 ${i % 3 === 0 ? 'w-1 h-3 bg-slate-400 dark:bg-slate-500' : 'w-0.5 h-2 bg-slate-300 dark:bg-slate-600'}`}
                                style={{
                                    top: '4px',
                                    transform: `translateX(-50%) rotate(${i * 30}deg) translateY(0)`,
                                    transformOrigin: '50% 72px'
                                }}
                            />
                        ))}

                        {/* Numbers */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">12</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">6</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">9</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">3</div>
                    </div>

                    {/* Hands Container - Centered */}
                    <div className="absolute inset-0">
                        {/* Center Dot */}
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-slate-800 dark:bg-white rounded-full z-20 shadow-sm -translate-x-1/2 -translate-y-1/2" />

                        {/* Hour Hand */}
                        <div
                            className="absolute top-1/2 left-1/2 w-1.5 h-10 bg-slate-800 dark:bg-slate-200 rounded-full origin-bottom z-10 shadow-sm"
                            style={{
                                // -translate-x-1/2 centers horizontally
                                // -translate-y-full moves it UP so bottom is at center
                                transform: `translate(-50%, -100%) rotate(${hoursRatio * 360}deg)`
                            }}
                        />

                        {/* Minute Hand */}
                        <div
                            className="absolute top-1/2 left-1/2 w-1 h-14 bg-slate-600 dark:bg-slate-400 rounded-full origin-bottom z-10 shadow-sm"
                            style={{
                                transform: `translate(-50%, -100%) rotate(${minutesRatio * 360}deg)`
                            }}
                        />

                        {/* Second Hand */}
                        <div
                            className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-red-500 rounded-full z-10 shadow-sm"
                            style={{
                                transformOrigin: '50% 80%', // Pivot near the bottom (20% tail)
                                transform: `translate(-50%, -80%) rotate(${secondsRatio * 360}deg)`
                            }}
                        />

                        {/* Second Hand Center Cap */}
                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full z-20 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="text-center w-full z-10">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg truncate px-2" title={city.name}>{city.name}</h3>
                    <div className="text-3xl font-mono text-blue-600 dark:text-blue-400 font-medium my-1 tracking-tight">
                        {localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        <span className="text-sm ml-1 text-slate-400">{localTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).slice(-2)}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {localTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* City Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Cities</h3>
                    <div className="text-xs text-slate-400">
                        {selectedCities.length} selected
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {commonCities.map(city => {
                        const isSelected = selectedCities.some(c => c.name === city.name);
                        return (
                            <button
                                key={city.name}
                                onClick={() => toggleCity(city)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${isSelected
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-500/20 shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                {city.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Clock Grid */}
            {selectedCities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {selectedCities.map((city) => (
                        <Clock key={city.name} city={city} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-3 text-slate-400">
                        <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No clocks selected</p>
                    <p className="text-sm text-slate-400 mt-1">Select one or more cities from the list above</p>
                </div>
            )}
        </div>
    );
}
