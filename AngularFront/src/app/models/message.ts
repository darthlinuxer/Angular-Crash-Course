export class Message {

    constructor(role:string, content:string) {
        this.role = role;
        this.content = content;                
    }

    role!: string;
    content!: string;
}