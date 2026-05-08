import { Room } from '../rooms/room.entity.js';
export declare class Table {
    id: string;
    name: string;
    capacity: number;
    roomId: string;
    room: Room;
}
