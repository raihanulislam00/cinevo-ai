import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateConversationDto { @IsString() @IsNotEmpty() @MaxLength(120) title!: string; }
export class ChatDto { @IsString() @IsNotEmpty() @MaxLength(10_000) message!: string; @IsOptional() @IsString() conversationId?: string | null; }
