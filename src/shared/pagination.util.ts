import { Model } from 'mongoose';

export async function paginate<T>(
  model: Model<T>,
  page: number = 1,
  limit: number = 10,
  query = {},
  select = '-password',
) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).select(select),
    model.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      currentPage: page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
