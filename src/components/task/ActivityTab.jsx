import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/helpers";

export function ActivityTab({ history }) {
  return (
    <ScrollArea className="h-96">
      <div className="relative pl-4">
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">No activity yet</p>
        ) : (
          history.map((h) => (
            <div key={h._id} className="relative flex gap-3 pb-4">
              <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="ml-3 flex-1">
                <p className="text-sm capitalize">
                  {h.action === "status_changed"
                    ? `Status changed from ${h.oldValue} to ${h.newValue}`
                    : h.action === "commented"
                      ? "Added a comment"
                      : h.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {h.changedBy?.name || "System"} – {formatDate(h.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
