/* eslint-disable linebreak-style */
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Post } from './posts'; // Import Post entity

@Entity( 'users' )
export class User{

  @PrimaryColumn()
    id: string;

  @Column()
    email: string;

  @Column()
    username: string;

  @Column()
    password: string;

  @Column( {
    nullable: true,
  } )
    last_logged_in_at: Date;

  @OneToMany( ()=>Post, post=>post.user ) // One user has many posts
    posts: Post[];


  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;

  @BeforeInsert()
  generateUUID(): void{

    this.id = `eu-${ uuidv4() }`;

  }

}

