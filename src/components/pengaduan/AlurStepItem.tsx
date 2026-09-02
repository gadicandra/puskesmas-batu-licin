import type { AlurPengaduanStep } from "./types";

interface AlurStepItemProps extends AlurPengaduanStep {
  isLast: boolean;
}

export default function AlurStepItem({
  order,
  title,
  description,
  details,
  isLast,
}: AlurStepItemProps) {
  return (
    <li className="relative grid grid-cols-[3.5rem_1fr] gap-4 sm:grid-cols-[5rem_1fr] sm:gap-5">
      <div className="relative flex justify-center">
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-12 bottom-[-1.5rem] left-1/2 w-2 -translate-x-1/2 rounded-full bg-pengaduan-accent sm:top-16 sm:bottom-[-2rem]"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute top-5 right-0 h-2 w-8 rounded-full bg-pengaduan-accent sm:top-7 sm:w-12"
        />
        <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-pengaduan-accent text-2xl font-black leading-none text-pengaduan-dark sm:h-16 sm:w-16 sm:text-4xl">
          {order}
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-center py-1 sm:py-2">
        <h3 className="text-lg font-black leading-tight text-pengaduan-dark sm:text-2xl">
          {title}
        </h3>
        <p
          className="mt-1 max-w-prose text-sm font-medium leading-relaxed sm:text-base"
          style={{ color: "var(--color-pengaduan-dark)" }}
        >
          {description}
        </p>
        {details && details.length > 0 && (
          <ul
            className="mt-1 max-w-prose space-y-1 text-sm font-medium leading-relaxed sm:text-base"
            style={{ color: "var(--color-pengaduan-dark)" }}
          >
            {details.map((detail) => (
              <li key={detail} className="flex gap-2">
                <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-pengaduan-accent" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
