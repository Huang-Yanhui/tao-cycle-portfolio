export const scrollChapters = ["top", "chapter-0", "chapter-1", "chapter-2", "chapter-3"] as const;
export const chapterAtmospheres = ["晨光初照", "清气生发", "日影渐长", "月照山河", "一息归元"];

export type CycleAnchor = { position: number; travel: number; night: number };

// One complete forward panorama pass. The last chapter lands at the same
// panorama position and light level as the opening, without reversing travel.
export function measureCycle(): CycleAnchor[] {
  const travel = [0, 0.13, 0.37, 0.66, 1];
  const night = [0, 0, 0.38, 1, 0];
  const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  return scrollChapters.map((id, index) => {
    const section = document.getElementById(id);
    const top = section ? section.getBoundingClientRect().top + scrollY : 0;
    const centered = top + ((section?.offsetHeight ?? innerHeight) - innerHeight) / 2;
    return { position: Math.max(0, Math.min(maximum, centered)), travel: travel[index], night: night[index] };
  });
}

export function sampleCycle(position: number, anchors: CycleAnchor[]) {
  let segment = anchors.length - 2;
  for (let index = 0; index < anchors.length - 1; index++) {
    if (position <= anchors[index + 1].position) { segment = index; break; }
  }
  const start = anchors[segment];
  const end = anchors[segment + 1];
  const fraction = Math.max(0, Math.min(1, (position - start.position) / Math.max(1, end.position - start.position)));
  const eased = fraction * fraction * (3 - 2 * fraction);
  return {
    travel: start.travel + (end.travel - start.travel) * eased,
    night: start.night + (end.night - start.night) * eased,
    chapter: segment + (fraction >= 0.5 ? 1 : 0),
  };
}
