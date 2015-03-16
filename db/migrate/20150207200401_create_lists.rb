class CreateLists < ActiveRecord::Migration
  def change
    create_table :lists do |t|
      t.integer :user_id
      t.string :ingredients

      t.timestamps
    end
  end
end
