class Todo < ActiveRecord::Base
  attr_accessible :title, :completed, :position
end
