export type Range = [number, number];
export type JobEstimate = { id: string; name: string; inspection: number; labour: Range; parts: Range; partsNote: string };

export const jobEstimates: Record<string, JobEstimate[]> = {
  appliance: [
    { id: "washer-drain", name: "Washing machine not draining", inspection: 299, labour: [300, 600], parts: [800, 1800], partsNote: "Drain pump or filter" },
    { id: "fridge-cooling", name: "Refrigerator not cooling", inspection: 299, labour: [400, 800], parts: [1200, 3500], partsNote: "Relay, thermostat or gas top-up" },
    { id: "microwave-heat", name: "Microwave not heating", inspection: 249, labour: [300, 500], parts: [600, 1500], partsNote: "Fuse, diode or magnetron" },
  ],
  electrical: [
    { id: "switch-socket", name: "Switch or socket replacement", inspection: 199, labour: [150, 300], parts: [80, 300], partsNote: "Modular switch or socket" },
    { id: "mcb-trip", name: "MCB keeps tripping", inspection: 249, labour: [300, 600], parts: [400, 900], partsNote: "Replacement MCB, if faulty" },
    { id: "fan-repair", name: "Ceiling fan repair", inspection: 199, labour: [200, 400], parts: [150, 600], partsNote: "Capacitor or bearing" },
  ],
  plumbing: [
    { id: "tap-leak", name: "Leaking tap", inspection: 199, labour: [200, 350], parts: [250, 900], partsNote: "Washer or cartridge" },
    { id: "drain-block", name: "Blocked drain", inspection: 199, labour: [300, 700], parts: [0, 200], partsNote: "Usually none" },
    { id: "flush-tank", name: "Running flush tank", inspection: 199, labour: [250, 450], parts: [300, 1200], partsNote: "Fill or flush valve" },
  ],
  carpentry: [
    { id: "door-align", name: "Door not closing properly", inspection: 249, labour: [300, 600], parts: [100, 400], partsNote: "Hinges or screws" },
    { id: "drawer-channel", name: "Broken drawer channel", inspection: 249, labour: [250, 500], parts: [200, 600], partsNote: "Telescopic channel pair" },
    { id: "furniture-joint", name: "Loose furniture joint", inspection: 249, labour: [400, 900], parts: [150, 500], partsNote: "Brackets, dowels or adhesive" },
  ],
  electronics: [
    { id: "tv-backlight", name: "TV has sound but no picture", inspection: 349, labour: [500, 900], parts: [1500, 3500], partsNote: "Backlight strips" },
    { id: "laptop-battery", name: "Laptop battery replacement", inspection: 349, labour: [300, 500], parts: [2500, 5500], partsNote: "Compatible battery" },
  ],
  installation: [
    { id: "ac-install", name: "Split AC installation", inspection: 299, labour: [1200, 1800], parts: [600, 1500], partsNote: "Extra copper pipe, if needed" },
    { id: "geyser-install", name: "Water heater installation", inspection: 249, labour: [500, 900], parts: [200, 700], partsNote: "Pipes and connectors" },
  ],
};

export const rangeTotal = (j: JobEstimate, includeParts: boolean): Range => [
  j.inspection + j.labour[0] + (includeParts ? j.parts[0] : 0),
  j.inspection + j.labour[1] + (includeParts ? j.parts[1] : 0),
];
