export declare class Queue<I> {
    items: I[];
    constructor();
    enqueue(element: any): void;
    dequeue(): I | "Queue is empty" | undefined;
    peek(): I | "Queue is empty";
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    print(): void;
}
