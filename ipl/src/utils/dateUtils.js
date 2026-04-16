/**
 * centralized Date & Time utilities for localization
 */

export const getTimezoneShort = () => {
    try {
      // Returns short code like "IST", "EDT", "BST"
      const date = new Date();
      return new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(date)
        .find(p => p.type === 'timeZoneName').value;
    } catch (e) {
      return "";
    }
  };
  
  export const formatToLocalTime = (isoString, includeTz = true) => {
    if (!isoString) return "TBA";
    const date = new Date(isoString);
    if (isNaN(date)) return "TBA";
  
    // 12-hour format as requested
    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    
    if (!includeTz) return timeStr;
    
    const tz = getTimezoneShort();
    return `${timeStr} ${tz}`.trim();
  };
  
  export const formatToLocalDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString();
  };
  
  export const formatToLongDateTime = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      if (isNaN(date)) return "";
      
      const dateStr = date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
      });
      const timeStr = formatToLocalTime(isoString);
      return `${dateStr}, ${timeStr}`;
  };
  
  /**
   * Converts a datetime-local input value (naive local string)
   * to a proper UTC ISO string for backend storage.
   */
  export const toUTCISO = (localString) => {
    if (!localString) return null;
    const date = new Date(localString);
    return isNaN(date) ? null : date.toISOString();
  };
