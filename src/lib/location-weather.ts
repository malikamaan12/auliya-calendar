import { CITY_PRESETS, CityPreset } from "./prayer-engine";

export interface TimezoneOption {
  tz: string;
  region: string;
  cityLabel: string;
  utcOffsetLabel: string;
  offsetMinutes: number;
}

export interface LiveWeatherData {
  fetchedAt: number;
  temperatureC: number;
  apparentTemperatureC: number;
  tempMaxC: number;
  tempMinC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  cloudCoverPct: number;
  precipitationMm: number;
  weatherCode: number;
  weatherLabel: string;
  isDay: boolean;
  uvIndex: number;
  usAqi: number | null;
  europeanAqi: number | null;
  pm25: number | null;
  pm10: number | null;
  ozone: number | null;
  dust: number | null;
  resolvedTimezone?: string;
}

export interface GeocodedLocation {
  id: string;
  name: string;
  admin1?: string;
  country: string;
  lat: number;
  lng: number;
  tz: string;
  elevation?: number;
}

/** Coordinates for major IANA timezone hubs when switching timezone without GPS lock. */
const TIMEZONE_COORDINATE_MAP: Record<string, { name: string; country: string; lat: number; lng: number }> = {
  "Asia/Kolkata": { name: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  "Asia/Calcutta": { name: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  "Asia/Karachi": { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011 },
  "Asia/Dhaka": { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 },
  "Asia/Riyadh": { name: "Makkah al-Mukarramah", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262 },
  "Asia/Dubai": { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  "Asia/Qatar": { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531 },
  "Asia/Kuwait": { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774 },
  "Asia/Bahrain": { name: "Manama", country: "Bahrain", lat: 26.2285, lng: 50.586 },
  "Asia/Muscat": { name: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829 },
  "Asia/Baghdad": { name: "Baghdad", country: "Iraq", lat: 33.3152, lng: 44.3661 },
  "Asia/Tehran": { name: "Tehran", country: "Iran", lat: 35.6892, lng: 51.389 },
  "Asia/Kabul": { name: "Kabul", country: "Afghanistan", lat: 34.5553, lng: 69.2075 },
  "Asia/Tashkent": { name: "Tashkent", country: "Uzbekistan", lat: 41.2995, lng: 69.2401 },
  "Asia/Almaty": { name: "Almaty", country: "Kazakhstan", lat: 43.222, lng: 76.8512 },
  "Asia/Baku": { name: "Baku", country: "Azerbaijan", lat: 40.4093, lng: 49.8671 },
  "Asia/Amman": { name: "Amman", country: "Jordan", lat: 31.9454, lng: 35.9284 },
  "Asia/Beirut": { name: "Beirut", country: "Lebanon", lat: 33.8938, lng: 35.5018 },
  "Asia/Damascus": { name: "Damascus", country: "Syria", lat: 33.5138, lng: 36.2765 },
  "Asia/Jerusalem": { name: "Al-Quds (Jerusalem)", country: "Palestine", lat: 31.7683, lng: 35.2137 },
  "Asia/Gaza": { name: "Gaza", country: "Palestine", lat: 31.5017, lng: 34.4668 },
  "Asia/Jakarta": { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  "Asia/Makassar": { name: "Makassar", country: "Indonesia", lat: -5.1477, lng: 119.4327 },
  "Asia/Kuala_Lumpur": { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
  "Asia/Singapore": { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  "Asia/Brunei": { name: "Bandar Seri Begawan", country: "Brunei", lat: 4.9031, lng: 114.9398 },
  "Asia/Bangkok": { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  "Asia/Manila": { name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  "Asia/Tokyo": { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  "Asia/Seoul": { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
  "Asia/Shanghai": { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  "Asia/Hong_Kong": { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  "Asia/Colombo": { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612 },
  "Asia/Kathmandu": { name: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.324 },
  "Europe/Istanbul": { name: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784 },
  "Europe/London": { name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  "Europe/Dublin": { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  "Europe/Paris": { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  "Europe/Berlin": { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  "Europe/Amsterdam": { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  "Europe/Brussels": { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  "Europe/Madrid": { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  "Europe/Rome": { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  "Europe/Zurich": { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  "Europe/Vienna": { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  "Europe/Stockholm": { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  "Europe/Oslo": { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  "Europe/Moscow": { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
  "Europe/Sarajevo": { name: "Sarajevo", country: "Bosnia", lat: 43.8563, lng: 18.4131 },
  "Africa/Cairo": { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  "Africa/Casablanca": { name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
  "Africa/Algiers": { name: "Algiers", country: "Algeria", lat: 36.7538, lng: 3.0588 },
  "Africa/Tunis": { name: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815 },
  "Africa/Lagos": { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  "Africa/Nairobi": { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  "Africa/Johannesburg": { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  "Africa/Khartoum": { name: "Khartoum", country: "Sudan", lat: 15.5007, lng: 32.5599 },
  "America/New_York": { name: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  "America/Chicago": { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  "America/Denver": { name: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
  "America/Los_Angeles": { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  "America/Toronto": { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  "America/Vancouver": { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  "America/Mexico_City": { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  "America/Sao_Paulo": { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  "America/Argentina/Buenos_Aires": { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  "Australia/Sydney": { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  "Australia/Melbourne": { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  "Australia/Perth": { name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605 },
  "Pacific/Auckland": { name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
};

/** Compute UTC offset label (e.g. "UTC+05:30") and offset in minutes for any IANA timezone. */
export function getTimezoneOffsetInfo(tz: string, refDate: Date = new Date()): { label: string; minutes: number } {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = fmt.formatToParts(refDate);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT";
    const normalized = tzPart.replace("GMT", "UTC");
    if (normalized === "UTC") return { label: "UTC±00:00", minutes: 0 };
    const match = normalized.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!match) return { label: normalized, minutes: 0 };
    const sign = match[1] === "-" ? -1 : 1;
    const hrs = parseInt(match[2], 10);
    const mins = parseInt(match[3] || "0", 10);
    const label = `UTC${match[1]}${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    return { label, minutes: sign * (hrs * 60 + mins) };
  } catch {
    return { label: "UTC", minutes: 0 };
  }
}

/** Return the complete list of all supported IANA timezones in the runtime. */
export function getAllWorldTimezones(): TimezoneOption[] {
  let rawList: string[] = [];
  try {
    if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
      rawList = (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone");
    }
  } catch {
    rawList = [];
  }
  if (rawList.length === 0) {
    rawList = Object.keys(TIMEZONE_COORDINATE_MAP);
  }
  const now = new Date();
  return rawList.map((tz) => {
    const segs = tz.split("/");
    const region = segs[0] || "Global";
    const cityLabel = (segs[segs.length - 1] || tz).replace(/_/g, " ");
    const off = getTimezoneOffsetInfo(tz, now);
    return {
      tz,
      region,
      cityLabel,
      utcOffsetLabel: off.label,
      offsetMinutes: off.minutes,
    };
  });
}

/** Resolve a CityPreset when the user selects an IANA timezone from the complete timezone selector. */
export function resolveCityForTimezone(tz: string, currentCity: CityPreset): CityPreset {
  const mapped = TIMEZONE_COORDINATE_MAP[tz];
  if (mapped) {
    return {
      id: `tz-${tz}`,
      name: mapped.name,
      country: mapped.country,
      lat: mapped.lat,
      lng: mapped.lng,
      tz,
    };
  }
  const preset = CITY_PRESETS.find((c) => c.tz === tz);
  if (preset) {
    return { ...preset, tz };
  }
  // Estimate longitude from timezone offset if switching to an unmapped timezone before geocoding completes
  const off = getTimezoneOffsetInfo(tz);
  const approxLng = Number(((off.minutes / 60) * 15).toFixed(4));
  const cityLabel = (tz.split("/").pop() || tz).replace(/_/g, " ");
  const regionLabel = tz.split("/")[0] || currentCity.country;
  return {
    id: `tz-${tz}`,
    name: cityLabel,
    country: regionLabel,
    lat: currentCity.lat,
    lng: approxLng,
    tz,
  };
}

/** Reverse-geocode GPS coordinates to a real city name, country, and IANA timezone. */
export async function reverseGeocodeGps(lat: number, lng: number): Promise<CityPreset> {
  let detectedTz: string | undefined;
  try {
    detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    detectedTz = undefined;
  }

  let cityName = "GPS Location";
  let countryName = `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`;

  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
        lat
      )}&longitude=${encodeURIComponent(lng)}&localityLanguage=en`
    );
    if (res.ok) {
      const data = (await res.json()) as {
        city?: string;
        locality?: string;
        principalSubdivision?: string;
        countryName?: string;
        informative?: { administrative?: { name?: string }[]; timeZone?: { ianaTimeId?: string }[] };
      };
      cityName = data.city || data.locality || data.principalSubdivision || cityName;
      countryName = data.countryName || countryName;
      const iana = data.informative?.timeZone?.find((t) => t.ianaTimeId)?.ianaTimeId;
      if (iana) detectedTz = iana;
    }
  } catch {
    // Fallback to coordinate label if offline
  }

  return {
    id: "gps",
    name: cityName,
    country: countryName,
    lat: Number(lat.toFixed(5)),
    lng: Number(lng.toFixed(5)),
    tz: detectedTz,
  };
}

/** Search 200,000+ world cities/towns via Open-Meteo Geocoding API with exact coordinates & IANA timezone. */
export async function searchWorldLocations(query: string): Promise<GeocodedLocation[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    results?: {
      id: number;
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
      elevation?: number;
    }[];
  };
  if (!data.results) return [];
  return data.results.map((r) => ({
    id: `geo-${r.id}`,
    name: r.name,
    admin1: r.admin1,
    country: r.country || "",
    lat: Number(r.latitude.toFixed(4)),
    lng: Number(r.longitude.toFixed(4)),
    tz: r.timezone || "UTC",
    elevation: r.elevation,
  }));
}

export function describeWmoWeatherCode(code: number): string {
  switch (code) {
    case 0:
      return "Clear Sky";
    case 1:
      return "Mainly Clear";
    case 2:
      return "Partly Cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Foggy / Mist";
    case 51:
    case 53:
    case 55:
      return "Light Drizzle";
    case 56:
    case 57:
      return "Freezing Drizzle";
    case 61:
    case 63:
    case 65:
      return "Rain";
    case 66:
    case 67:
      return "Freezing Rain";
    case 71:
    case 73:
    case 75:
    case 77:
      return "Snowfall";
    case 80:
    case 81:
    case 82:
      return "Rain Showers";
    case 85:
    case 86:
      return "Snow Showers";
    case 95:
    case 96:
    case 99:
      return "Thunderstorm";
    default:
      return "Fair Weather";
  }
}

export function getAqiCategory(usAqi: number | null): {
  label: string;
  advisory: string;
  color: string;
  bg: string;
} {
  if (usAqi === null || Number.isNaN(usAqi)) {
    return {
      label: "Measuring…",
      advisory: "Fetching local atmospheric station telemetry.",
      color: "var(--text-muted)",
      bg: "var(--bg-muted)",
    };
  }
  if (usAqi <= 50) {
    return {
      label: "Good",
      advisory: "Clean air — ideal for walking to the Masjid and outdoor Ziyarat.",
      color: "#34D399",
      bg: "rgba(52, 211, 153, 0.14)",
    };
  }
  if (usAqi <= 100) {
    return {
      label: "Moderate",
      advisory: "Air quality is acceptable for daily outdoor travel to Jamaat.",
      color: "#FBBF24",
      bg: "rgba(251, 191, 36, 0.14)",
    };
  }
  if (usAqi <= 150) {
    return {
      label: "Sensitive",
      advisory: "Elders and sensitive individuals should limit prolonged outdoor exertion.",
      color: "#FB923C",
      bg: "rgba(251, 146, 60, 0.16)",
    };
  }
  if (usAqi <= 200) {
    return {
      label: "Unhealthy",
      advisory: "Elevated particulate matter — consider wearing a mask outdoors.",
      color: "#F87171",
      bg: "rgba(248, 113, 113, 0.16)",
    };
  }
  return {
    label: "Very Unhealthy",
    advisory: "High pollution alert — minimize outdoor exposure.",
    color: "#C084FC",
    bg: "rgba(192, 132, 252, 0.18)",
  };
}

/** Fetch real-time Weather AND Air Quality Index (AQI) for [lat, lng] from Open-Meteo. */
export async function fetchWeatherAndAqi(lat: number, lng: number): Promise<LiveWeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
    lat
  )}&longitude=${encodeURIComponent(
    lng
  )}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(
    lat
  )}&longitude=${encodeURIComponent(
    lng
  )}&current=us_aqi,european_aqi,pm10,pm2_5,ozone,dust,uv_index&timezone=auto`;

  const [wRes, aRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!wRes.ok) {
    throw new Error(`Weather service HTTP ${wRes.status}`);
  }

  const wJson = (await wRes.json()) as {
    timezone?: string;
    current?: {
      temperature_2m?: number;
      relative_humidity_2m?: number;
      apparent_temperature?: number;
      is_day?: number;
      precipitation?: number;
      weather_code?: number;
      cloud_cover?: number;
      surface_pressure?: number;
      wind_speed_10m?: number;
      wind_direction_10m?: number;
    };
    daily?: {
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      uv_index_max?: number[];
    };
  };

  let aJson: {
    current?: {
      us_aqi?: number | null;
      european_aqi?: number | null;
      pm10?: number | null;
      pm2_5?: number | null;
      ozone?: number | null;
      dust?: number | null;
      uv_index?: number | null;
    };
  } | null = null;

  if (aRes && aRes.ok) {
    try {
      aJson = await aRes.json();
    } catch {
      aJson = null;
    }
  }

  const c = wJson.current || {};
  const d = wJson.daily || {};
  const ac = aJson?.current || {};
  const code = c.weather_code ?? 0;

  return {
    fetchedAt: Date.now(),
    temperatureC: c.temperature_2m ?? 0,
    apparentTemperatureC: c.apparent_temperature ?? c.temperature_2m ?? 0,
    tempMaxC: d.temperature_2m_max?.[0] ?? c.temperature_2m ?? 0,
    tempMinC: d.temperature_2m_min?.[0] ?? c.temperature_2m ?? 0,
    humidityPct: c.relative_humidity_2m ?? 0,
    windSpeedKmh: c.wind_speed_10m ?? 0,
    windDirectionDeg: c.wind_direction_10m ?? 0,
    surfacePressureHpa: c.surface_pressure ?? 1013,
    cloudCoverPct: c.cloud_cover ?? 0,
    precipitationMm: c.precipitation ?? 0,
    weatherCode: code,
    weatherLabel: describeWmoWeatherCode(code),
    isDay: (c.is_day ?? 1) === 1,
    uvIndex: ac.uv_index ?? d.uv_index_max?.[0] ?? 0,
    usAqi: typeof ac.us_aqi === "number" ? Math.round(ac.us_aqi) : null,
    europeanAqi: typeof ac.european_aqi === "number" ? Math.round(ac.european_aqi) : null,
    pm25: typeof ac.pm2_5 === "number" ? Number(ac.pm2_5.toFixed(1)) : null,
    pm10: typeof ac.pm10 === "number" ? Number(ac.pm10.toFixed(1)) : null,
    ozone: typeof ac.ozone === "number" ? Math.round(ac.ozone) : null,
    dust: typeof ac.dust === "number" ? Math.round(ac.dust) : null,
    resolvedTimezone: wJson.timezone,
  };
}

/** Exact Great-Circle distance from [lat, lng] to the Holy Kaaba (21.422487° N, 39.826206° E). */
export function getKaabaDistanceKm(lat: number, lng: number): number {
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;
  const R = 6371.0088;
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLon = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/**
 * Low-order spherical harmonic approximation of Earth's magnetic declination (degrees East of True North)
 * based on geomagnetic dipole pole (~80.7°N, 72.7°W) so users can compare True North vs Magnetic North.
 */
export function getMagneticDeclinationDeg(lat: number, lng: number): number {
  const rad = Math.PI / 180;
  const poleLat = 80.65 * rad;
  const poleLng = -72.68 * rad;
  const phi = lat * rad;
  const lam = lng * rad;
  const dLam = poleLng - lam;
  const y = Math.sin(dLam) * Math.cos(poleLat);
  const x = Math.cos(phi) * Math.sin(poleLat) - Math.sin(phi) * Math.cos(poleLat) * Math.cos(dLam);
  const dec = (Math.atan2(y, x) * 180) / Math.PI;
  return Number(Math.max(-25, Math.min(25, dec)).toFixed(1));
}

/**
 * Compute real-time Solar Azimuth (0-360° from North) and Altitude (-90° to +90°)
 * for [lat, lng] at `date`, enabling Solar Qibla shadow/sun alignment when magnetometers have interference.
 */
export function getSolarPosition(lat: number, lng: number, date: Date): { azimuthDeg: number; altitudeDeg: number } {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;
  const dayMs = 86400000;
  const jd = date.getTime() / dayMs + 2440587.5;
  const d = jd - 2451545.0;

  // Mean anomaly & ecliptic longitude of the Sun
  const g = ((357.529 + 0.98560028 * d) % 360) * rad;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = ((q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) * rad;
  const e = (23.439 - 0.00000036 * d) * rad;

  const sinDec = Math.sin(e) * Math.sin(L);
  const dec = Math.asin(sinDec);
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));

  // Greenwich Mean Sidereal Time
  const gmst = ((280.46061837 + 360.98564736629 * d) % 360) * rad;
  const lst = gmst + lng * rad;
  const ha = lst - ra;

  const phi = lat * rad;
  const sinAlt = Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

  const y = -Math.sin(ha);
  const x = Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(ha);
  const az = ((Math.atan2(y, x) * deg) + 360) % 360;

  return {
    azimuthDeg: Math.round(az),
    altitudeDeg: Number((alt * deg).toFixed(1)),
  };
}
