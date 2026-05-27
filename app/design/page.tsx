// app/_design/page.tsx
//
// BAUHAUS DESIGN SHOWCASE
// =========================================================================
// Temporary page demonstrating every element of the design system.
// Visit at /_design while building the app, then delete this folder when
// the real pages are in place.
//
// Sections:
//   1. Color palette        — every named color, used as a swatch
//   2. Typography           — display, headings, body, labels
//   3. Buttons              — every variant, shape, size, and state
//   4. Cards                — with each corner-shape variant
//   5. Accordion (FAQ)      — closed and open states
//   6. Geometric primitives — shapes + composed logo
//   7. Color-block sections — the signature full-bleed panels
//   8. Shadows              — every offset depth in the system
// =========================================================================

import { ArrowRight, Check, Quote } from "lucide-react";

import { Button } from "@/components/Button";
import { Card, CardTitle, CardBody } from "@/components/Card";
import { Accordion } from "@/components/Accordion";
import { Circle, Square, Triangle, GeometricLogo } from "@/components/Shapes";

// Small section-header helper so each block has the same heading style.
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-8">
      <span className="inline-block text-xs font-bold uppercase tracking-widest bg-bauhaus-fg text-white px-3 py-1">
        {label}
      </span>
      <h2 className="mt-3 text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}

export default function DesignShowcase() {
  return (
    <main>
      {/* =================================================================
          HEADER — sets the tone: thick border, geometric logo, declarative
          ================================================================= */}
      <header className="border-b-4 border-bauhaus-fg bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GeometricLogo size={28} />
            <span className="font-black uppercase tracking-tightest text-xl">
              Design System
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Bauhaus / v1
          </span>
        </div>
      </header>

      {/* =================================================================
          HERO — asymmetric two-panel layout, classic Bauhaus poster move.
          Left: massive headline. Right: solid blue with geometric composition.
          ================================================================= */}
      <section className="border-b-4 border-bauhaus-fg grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
        {/* Left panel — white, headline-led */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest mb-4">
            Form / Function / Color
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl">
            Geometry<br />
            is the<br />
            <span className="text-bauhaus-red">Interface</span>.
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium leading-relaxed">
            Every element below is built from circles, squares, and
            triangles — composed, never decorated.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="red" size="lg">
              Browse Sketches <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </Button>
            <Button variant="outline" size="lg">View Source</Button>
          </div>
        </div>

        {/* Right panel — solid blue with overlapping geometric composition */}
        <div className="relative bg-bauhaus-blue min-h-[400px] lg:min-h-0 overflow-hidden text-white bauhaus-dot-grid">
          {/* Composition: large yellow circle, red rotated square, white triangle */}
          <span
            aria-hidden
            className="absolute top-1/4 left-1/3 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-bauhaus-yellow border-4 border-bauhaus-fg"
          />
          <span
            aria-hidden
            className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-bauhaus-red border-4 border-bauhaus-fg rotate-45"
          />
          <span aria-hidden className="absolute top-8 right-8">
            <Triangle size={64} color="white" />
          </span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-24">

        {/* =================================================================
            1. COLOR PALETTE
            ================================================================= */}
        <section>
          <SectionHeader label="01 / Tokens" title="The Palette" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Red",    var: "bauhaus-red",    hex: "#D02020", text: "white" },
              { name: "Blue",   var: "bauhaus-blue",   hex: "#1040C0", text: "white" },
              { name: "Yellow", var: "bauhaus-yellow", hex: "#F0C020", text: "black" },
              { name: "Black",  var: "bauhaus-fg",     hex: "#121212", text: "white" },
              { name: "Canvas", var: "bauhaus-bg",     hex: "#F0F0F0", text: "black" },
              { name: "Muted",  var: "bauhaus-muted",  hex: "#E0E0E0", text: "black" },
            ].map((c) => (
              <div
                key={c.var}
                className={`bg-${c.var} text-${c.text === "white" ? "white" : "bauhaus-fg"} border-2 border-bauhaus-fg shadow-bauhaus p-4 aspect-square flex flex-col justify-between`}
              >
                <span className="font-bold uppercase tracking-wider text-sm">{c.name}</span>
                <div>
                  <div className="font-mono text-xs">{c.hex}</div>
                  <div className="font-mono text-xs opacity-70">--color-{c.var}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            2. TYPOGRAPHY
            ================================================================= */}
        <section>
          <SectionHeader label="02 / Type" title="Typography Scale" />
          <div className="space-y-8 border-4 border-bauhaus-fg bg-white shadow-bauhaus-lg p-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bauhaus-fg/60">
                Display — text-8xl font-black
              </span>
              <p className="text-8xl">Aa Bb 01</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bauhaus-fg/60">
                Heading 1 — text-6xl
              </span>
              <h1 className="text-6xl">Heading One</h1>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bauhaus-fg/60">
                Heading 2 — text-4xl
              </span>
              <h2 className="text-4xl">Heading Two</h2>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bauhaus-fg/60">
                Heading 3 — text-2xl
              </span>
              <h3 className="text-2xl">Heading Three</h3>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bauhaus-fg/60">
                Body — text-base font-medium
              </span>
              <p className="text-base max-w-2xl leading-relaxed font-medium">
                The Bauhaus philosophy holds that form should follow function. This
                body copy is set in Outfit at weight 500, with relaxed line-height
                for readability. Headlines above it scream; body text speaks.
              </p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bauhaus-fg/60">
                Label — uppercase, tracking-widest
              </span>
              <p className="font-bold uppercase tracking-widest text-sm">
                Section / Subsection / Detail
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. BUTTONS — every variant × shape × state
            ================================================================= */}
        <section>
          <SectionHeader label="03 / Controls" title="Buttons" />

          <div className="space-y-8">
            {/* Variants */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3">Variants</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="red">Primary Red</Button>
                <Button variant="blue">Secondary Blue</Button>
                <Button variant="yellow">Yellow</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Shapes */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3">Shapes</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="red" shape="square">Square</Button>
                <Button variant="red" shape="pill">Pill</Button>
                <Button variant="blue" shape="square">
                  With Icon <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="yellow" size="sm">Small</Button>
                <Button variant="yellow" size="md">Medium</Button>
                <Button variant="yellow" size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3">
                States — hover for tint, click for press, tab for focus ring
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="red">Try Pressing Me</Button>
                <Button variant="red" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            4. CARDS — every corner-shape variant
            ================================================================= */}
        <section>
          <SectionHeader label="04 / Surfaces" title="Cards" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card lift cornerShape="circle" cornerColor="red">
              <CardTitle>Circle Corner</CardTitle>
              <CardBody>
                The default card. Thick black border, hard offset shadow,
                small geometric decoration in the corner. Hover to see it lift.
              </CardBody>
            </Card>

            <Card lift cornerShape="square" cornerColor="blue">
              <CardTitle>Square Corner</CardTitle>
              <CardBody>
                Same card construction, different corner decoration. Vary
                shapes and colors to create rhythm across a grid of cards.
              </CardBody>
            </Card>

            <Card lift cornerShape="triangle" cornerColor="yellow">
              <CardTitle>Triangle Corner</CardTitle>
              <CardBody>
                Triangles complete the Bauhaus trio. Use sparingly — they
                draw the eye more than circles or squares.
              </CardBody>
            </Card>
          </div>
        </section>

        {/* =================================================================
            5. ACCORDION
            ================================================================= */}
        <section>
          <SectionHeader label="05 / Patterns" title="Accordion" />

          <Accordion
            items={[
              {
                question: "What runtimes are supported?",
                answer:
                  "p5.js, Three.js, PixiJS, and vanilla Canvas/WebGL out of the box. Each sketch declares its runtime; the iframe shell loads the right library via an import map.",
              },
              {
                question: "How do parameter controls work?",
                answer:
                  "Admins define a JSON schema describing each parameter (slider, color picker, toggle, etc.). The platform auto-generates the corresponding UI — admins never write React.",
              },
              {
                question: "Can I download the source code?",
                answer:
                  "Yes — every sketch has a download button that produces a standalone runnable ZIP with the right HTML boilerplate for the chosen runtime.",
              },
            ]}
          />
        </section>

        {/* =================================================================
            6. GEOMETRIC PRIMITIVES
            ================================================================= */}
        <section>
          <SectionHeader label="06 / Atoms" title="Geometric Primitives" />

          <div className="border-4 border-bauhaus-fg bg-white shadow-bauhaus-lg p-12 flex flex-wrap items-end gap-8 justify-center">
            <Circle size={80} color="red" />
            <Square size={80} color="blue" />
            <Triangle size={80} color="yellow" />
            <div className="w-px h-20 bg-bauhaus-fg" />
            <Circle size={60} color="yellow" />
            <Square size={60} color="red" className="rotate-45" />
            <Triangle size={60} color="blue" />
            <div className="w-px h-20 bg-bauhaus-fg" />
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest mb-3">
                Composed Logo
              </p>
              <GeometricLogo size={40} />
            </div>
          </div>
        </section>

        {/* =================================================================
            7. SHADOWS
            ================================================================= */}
        <section>
          <SectionHeader label="07 / Depth" title="Shadow Scale" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "shadow-bauhaus-sm", class: "shadow-bauhaus-sm" },
              { name: "shadow-bauhaus",    class: "shadow-bauhaus" },
              { name: "shadow-bauhaus-md", class: "shadow-bauhaus-md" },
              { name: "shadow-bauhaus-lg", class: "shadow-bauhaus-lg" },
            ].map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-4">
                <div className={`bg-white border-2 border-bauhaus-fg w-full aspect-square ${s.class}`} />
                <code className="text-xs font-mono">{s.name}</code>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* =================================================================
          8. COLOR-BLOCK SECTIONS — the signature Bauhaus full-bleed panels.
          These are some of the most identifiable elements of the system.
          ================================================================= */}

      {/* RED — benefits panel */}
      <section className="bg-bauhaus-red text-white border-y-4 border-bauhaus-fg py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white text-bauhaus-fg px-3 py-1">
            Color-Block / Red
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl max-w-3xl">
            Entire sections lean on a single primary.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {["Direct", "Bold", "Functional"].map((word) => (
              <div key={word} className="flex items-start gap-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-bauhaus-yellow border-2 border-bauhaus-fg flex items-center justify-center">
                  <Check className="h-5 w-5 text-bauhaus-fg" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="text-2xl">{word}</h3>
                  <p className="font-medium leading-relaxed mt-1 opacity-90">
                    Color blocking creates the unmistakable Bauhaus rhythm
                    across long-scrolling pages.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YELLOW — stats panel */}
      <section className="bg-bauhaus-yellow text-bauhaus-fg border-b-4 border-bauhaus-fg py-16 lg:py-24 relative overflow-hidden">
        {/* Decorative shape in the corner — classic Bauhaus poster move */}
        <span
          aria-hidden
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-bauhaus-red opacity-30 border-4 border-bauhaus-fg"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-bauhaus-fg text-white px-3 py-1">
            Color-Block / Yellow
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl">By the numbers.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-12 border-4 border-bauhaus-fg bg-bauhaus-yellow divide-x-4 divide-y-4 lg:divide-y-0 divide-bauhaus-fg">
            {[
              { value: "120+", label: "Sketches" },
              { value: "4",    label: "Runtimes" },
              { value: "60fps", label: "Target" },
              { value: "0",    label: "Boilerplate" },
            ].map((stat) => (
              <div key={stat.label} className="p-8">
                <p className="text-5xl lg:text-6xl">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLUE — testimonial / quote panel */}
      <section className="bg-bauhaus-blue text-white border-b-4 border-bauhaus-fg py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="h-12 w-12 mx-auto mb-6 text-bauhaus-yellow" strokeWidth={3} />
          <p className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
            "Form follows function — but it also has to look fantastic."
          </p>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest">
            — Attributed to the Bauhaus
          </p>
        </div>
      </section>

      {/* =================================================================
          FOOTER
          ================================================================= */}
      <footer className="bg-bauhaus-fg text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GeometricLogo size={24} />
            <span className="font-black uppercase tracking-tightest">
              Design System / Bauhaus
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">
            Delete /app/_design when no longer needed
          </p>
        </div>
      </footer>
    </main>
  );
}
