// suncalc.js
const SunCalc = (function() {
    const rad = Math.PI / 180;
    const e = rad * 23.4397; 
    
    function toJulian(date) { return (date.valueOf() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5; }
    function fromJulian(j) { return new Date((j - 2440587.5) * 86400000); }
    function toDays(date) { return toJulian(date) - 2451545.0; }
    
    function sunCoords(d) {
        const M_coord = rad * (357.5291 + 0.98560028 * d);
        const C = rad * (1.9148 * Math.sin(M_coord) + 0.02 * Math.sin(2 * M_coord) + 0.0003 * Math.sin(3 * M_coord));
        const lambda = M_coord + C + rad * 102.9372 + Math.PI;
        return {
            dec: Math.asin(Math.sin(lambda) * Math.sin(e)),
            ra: Math.atan2(Math.sin(lambda) * Math.cos(e), Math.cos(lambda))
        };
    }

    return {
        getTimes: function(date, lat, lng) {
            const lw = rad * -lng;
            const phi = rad * lat;
            const d = toDays(date);
            const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
            
            const M_annex = 357.5291 + 0.98560028 * d + rad * 102.9372 + Math.PI;
            const Jtransit = 2451545.0 + 0.0009 + lw / (2 * Math.PI) + n + 0.0053 * Math.sin(rad * (357.5291 + 0.98560028 * d)) - 0.0069 * Math.sin(2 * rad * M_annex);
            const c = sunCoords(Jtransit - 2451545.0);
            const h0 = rad * -0.833;
            
            const cosH = (Math.sin(h0) - Math.sin(phi) * Math.sin(c.dec)) / (Math.cos(phi) * Math.cos(c.dec));
            
            if (cosH > 1 || cosH < -1) {
                return { sunrise: new Date(date.getTime() + 86400000), sunset: new Date(date.getTime() - 86400000) };
            }
            
            const H = Math.acos(cosH);
            const Jset = Jtransit + H / (2 * Math.PI);
            const Jrise = Jtransit - H / (2 * Math.PI);
            
            return {
                sunrise: fromJulian(Jrise),
                sunset: fromJulian(Jset)
            };
        }
    };
})();

// Macht die Variable explizit im globalen Namensraum der Extension verfügbar
window.SunCalc = SunCalc;