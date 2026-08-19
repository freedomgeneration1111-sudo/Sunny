export type AnalyticsEvent =
  | "cta_check_availability" | "cta_pricing" | "event_path_select" | "service_path_select"
  | "pricing_tab_change" | "pricing_item_toggle" | "pricing_to_inquiry"
  | "inquiry_step_complete" | "inquiry_submit_attempt" | "inquiry_submit_success" | "inquiry_submit_error"
  | "availability_check_attempt" | "availability_check_result" | "availability_cta_request_date" | "availability_cta_ask_options"
  | "chat_action_viewed" | "chat_action_clicked" | "chat_status_live" | "chat_status_async";
export function track(_event: AnalyticsEvent, _details?: Record<string, string | number | boolean>) {
  void _event; void _details;
  // Intentionally no-op until an analytics provider is approved.
}
