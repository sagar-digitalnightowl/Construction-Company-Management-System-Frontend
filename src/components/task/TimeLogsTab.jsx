import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration } from "@/lib/helpers";

export function TimeLogsTab({ timeLogs }) {
  return (
    <ScrollArea className="h-96">
      {timeLogs.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No time tracking records
        </p>
      ) : (
        timeLogs.map((log, idx) => (
          <div key={log._id || idx} className="border rounded-md p-3 mb-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">Session {idx + 1}</span>
                {log.isActive && (
                  <Badge variant="success" className="ml-2 text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <span className="font-medium">
                {!log.isActive
                  ? `${formatDuration(log.durationMinutes * 60)}`
                  : "In progress"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Started: {formatDate(log.startTime)}
              <br />
              {log.endTime && `Stopped: ${formatDate(log.endTime)}`}
            </div>
            {log.notes && (
              <p className="text-xs mt-1 italic">Notes: {log.notes}</p>
            )}
          </div>
        ))
      )}
    </ScrollArea>
  );
}
