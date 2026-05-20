// src/components/procurement/RFQCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Send, Eye } from "lucide-react";
import { formatDate } from "@/lib/helpers";

const statusColors = {
  draft: "secondary",
  sent: "default",
  expired: "destructive",
  closed: "outline",
};

export function RFQCard({ rfq, onSend, onView }) {
  return (
    <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{rfq.title}</p>
            <p className="text-xs text-muted-foreground">{rfq.rfqNumber}</p>
          </div>
          <Badge variant={statusColors[rfq.status]}>{rfq.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {rfq.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Deadline: {formatDate(rfq.submissionDeadline)}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onView(rfq._id)}>
            <Eye className="h-3 w-3 mr-1" /> View
          </Button>
          {rfq.status === "draft" && (
            <Button size="sm" onClick={() => onSend(rfq._id)}>
              <Send className="h-3 w-3 mr-1" /> Send
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
