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
  action: 'mouse_move' | 'left_click' | 'right_click' | 'type' | 'key' | 'screenshot';
  coordinate?: [number, number];
  text?: string;
}

