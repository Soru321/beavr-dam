import { Cycle, motion as m, SVGMotionProps } from "framer-motion";

interface NavToggleProps {
  toggle: Cycle;
}

export function NavToggle({ toggle }: NavToggleProps) {
  return (
    <button
      onClick={() => toggle()}
      className="absolute left-3 top-3.5 z-50 grid size-14 items-center justify-center rounded-full bg-transparent"
    >
      <svg width="20" height="24" viewBox="0 0 24 24">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </button>
  );
}

function Path(props: SVGMotionProps<SVGPathElement>) {
  return (
    <m.path
      fill="transparent"
      strokeWidth="3"
      stroke="hsl(var(--primary))"
      strokeLinecap="round"
      {...props}
    />
  );
}
