import {
    FullDecimalDegrees,
    DecimalDegrees,
    DegreesMinutesSeconds,
    Maidenhead,
    EPSG2180
} from "./coords.js";

var lat, long, last;

function addInput(id, obj) {
    const element = document.querySelector(id);
    const listener = (ev) => {
        const value = obj.tidy(ev.target.value);
        const valid = obj.regex.test(value);
        if (ev.type == "change" && valid) {
            // you could try to do it on the fly with https://stackoverflow.com/a/19803814/6732111
            ev.target.value = value;
        }
        if (!valid) { ev.target.classList.add("invalid"); return; }
        ev.target.classList.remove("invalid");

        [lat, long] = obj.convert(value);
        last = ev.target;
        document.dispatchEvent(new Event("coordsupdate"));
    };

    element.addEventListener("change", listener);
    element.addEventListener("input", listener);

    document.addEventListener("coordsupdate", () => {
        if (element == last) return;
        element.value = obj.generate(lat, long);
        element.classList.remove("invalid");
    })
}

addInput("#ddf", FullDecimalDegrees);
addInput("#dd", DecimalDegrees);
addInput("#dms", DegreesMinutesSeconds);
addInput("#maidenhead", Maidenhead);
addInput("#EPSG2180", EPSG2180);
