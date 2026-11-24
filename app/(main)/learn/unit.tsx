import { LessonButton } from "./lesson-button";
import { UnitBanner } from "./unit-banner";

export type UnitLesson = {
  slug: string;
  title: string;
  isCheckpoint: boolean;
  status: "PREVIEW" | "APPROVED";
  state: "complete" | "available" | "locked";
};

type UnitProps = {
  title: string;
  description: string;
  lessons: UnitLesson[];
  /** How many lessons of this tier come before this unit (keeps the zigzag going). */
  startIndex: number;
  currentSlug: string | null;
  /** Share of this unit's lessons that are finished; fills the ring. */
  percentage: number;
};

export const Unit = ({
  title,
  description,
  lessons,
  startIndex,
  currentSlug,
  percentage,
}: UnitProps) => {
  const open = lessons.find(
    (l) => l.state !== "locked" && l.state !== "complete"
  );
  return (
    <>
      <UnitBanner
        title={title}
        description={description}
        href={open ? `/lesson/${open.slug}` : undefined}
        preview={lessons.some((l) => l.status === "PREVIEW")}
      />

      <div className="relative flex flex-col items-center">
        {lessons.map((lesson, i) => (
          <LessonButton
            key={lesson.slug}
            slug={lesson.slug}
            title={lesson.title}
            index={startIndex + i}
            isFirst={startIndex + i === 0}
            isCheckpoint={lesson.isCheckpoint}
            state={lesson.state}
            current={lesson.slug === currentSlug}
            percentage={percentage}
          />
        ))}
      </div>
    </>
  );
};
