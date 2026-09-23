// Shared entrance for every row in the menu (nav links and contacts): each one enters a beat after the
// previous, in DOM order, and on close they all leave together (no stagger).
export const menuRowEnter = (open: boolean, index: number) => ({
  className: `transition duration-700 ease-expressive motion-reduce:transition-none ${
    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`,
  style: { transitionDelay: open ? `${250 + index * 80}ms` : "0ms" },
});
