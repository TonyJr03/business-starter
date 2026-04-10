export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  discountLabel?: string;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}
