import type { Ref } from "react";
import { ArrowButton } from "./ArrowButton";
import { ProjectDetails } from "./ProjectDetails";
import type { ShowcaseItem, ShowcaseLabels } from "./types";

/**
 * The lightbox: a transparent full-screen modal dialog with the project's card in the middle and
 * the previous/next arrows beside it (or under it on small screens). The refs and handlers come
 * from `useProjectLightbox`.
 */
export function ProjectDialog({
  item,
  hasSiblings,
  labels,
  dialogRef,
  panelRef,
  contentRef,
  onClose,
  onStep,
}: Readonly<{
  item: ShowcaseItem | undefined;
  hasSiblings: boolean;
  labels: ShowcaseLabels;
  dialogRef: Ref<HTMLDialogElement>;
  panelRef: Ref<HTMLDivElement>;
  contentRef: Ref<HTMLDivElement>;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}>) {
  return (
    <dialog
      ref={dialogRef}
      aria-label={item?.title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") onStep(-1);
        else if (event.key === "ArrowRight") onStep(1);
      }}
      className="showcase-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-4 text-foreground open:grid open:place-items-center"
    >
      {/* The dialog is a transparent full-screen layer so the arrows can sit outside the card
          (anything outside a modal dialog's box can't be clicked). The card is the visible shape
          the open/close animation clips. */}
      <div className="relative flex w-full max-w-6xl flex-col gap-4 min-[56rem]:max-w-324 min-[56rem]:px-18">
        <div
          ref={panelRef}
          className="max-h-[calc(100dvh-2rem-3.75rem)] overflow-x-hidden overflow-y-auto rounded-tr-[4rem] rounded-bl-xl border border-border bg-elevated min-[56rem]:max-h-[calc(100dvh-2rem)]"
        >
          {item && (
            <ProjectDetails item={item} labels={labels} contentRef={contentRef} onClose={onClose} />
          )}
        </div>

        {hasSiblings && (
          <div className="flex justify-between min-[56rem]:pointer-events-none min-[56rem]:absolute min-[56rem]:inset-0 min-[56rem]:items-center">
            <ArrowButton direction="previous" label={labels.previous} onClick={() => onStep(-1)} />
            <ArrowButton direction="next" label={labels.next} onClick={() => onStep(1)} />
          </div>
        )}
      </div>
    </dialog>
  );
}
