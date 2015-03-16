class CreateRecipes < ActiveRecord::Migration
  def change
    create_table :recipes do |t|
      t.integer :user_id
      t.string :food2fork_id

      t.timestamps
    end
  end
end
