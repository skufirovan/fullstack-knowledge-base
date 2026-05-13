import { Expose } from 'class-transformer'

export class Category {
  @Expose()
  readonly name: string

  @Expose()
  readonly slug: string

  @Expose()
  readonly description: string | null

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial)
  }
}
