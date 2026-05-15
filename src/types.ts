// Type definitions for voice computer control

export interface TranscriptionEvent {
  name: string;
  data?: {
    text?: string;
    is_final?: boolean;
    timestamp?: string;
    speaker?: string;
  };
}

export interface ComputerAction {
  action:
    | "mouse_move"
    | "left_click"
    | "right_click"
    | "middle_click"
    | "double_click"
    | "cursor_position"
    | "type"
    | "key"
    | "screenshot";
  coordinate?: [number, number];
  text?: string;
}
