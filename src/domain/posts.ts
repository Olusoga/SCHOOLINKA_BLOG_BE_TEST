/* eslint-disable linebreak-style */
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './users';

@Entity( 'posts' )
export class Post{

  @PrimaryColumn()
    id: string;


  @Column()
  @Index( { unique: true } )
    title: string;

  @Column()
    content: string;

  @ManyToOne( ()=>User, user=>user.posts )
  @JoinColumn( { name: 'user_id' } )
    user: User;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @BeforeInsert()
  generateUUID(): void{

    this.id = `post-${ uuidv4() }`;

  }

}
