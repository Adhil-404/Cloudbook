
import { toast } from 'react-toastify';

const WISHLIST_KEY = 'userWishlist';

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
}

export function addToWishlist(item) {
  try {
    const wishlist = getWishlist();
    if (!wishlist.some((w) => w.id === item._id || w.id === item.id)) {
      const wishlistItem = {
        id: item._id,
        title: item.title,
        author: item.author,
        category: item.category?.name || (typeof item.category === 'string' ? item.category : '') || 'Uncategorized',
        price: item.price,
        coverImage: item.coverImage,
        description: item.description
      };
      wishlist.push(wishlistItem);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      
      toast.success('Added to wishlist! ❤️', {
        position: "top-center",
        autoClose: 2000,
      });
      return true;
    } else {
      toast.info('This item is already in your wishlist!', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist. Please try again.', {
      position: "top-center",
      autoClose: 3000,
    });
    return false;
  }
}

export function removeFromWishlist(id) {
  try {
    const wishlist = getWishlist().filter((item) => item.id !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    
    toast.success('Removed from wishlist', {
      position: "top-center",
      autoClose: 2000,
    });
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove from wishlist. Please try again.', {
      position: "top-center",
      autoClose: 3000,
    });
    return false;
  }
}

export function clearWishlist() {
  try {
    localStorage.removeItem(WISHLIST_KEY);
    toast.success('Wishlist cleared', {
      position: "top-center",
      autoClose: 2000,
    });
    return true;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    toast.error('Failed to clear wishlist. Please try again.', {
      position: "top-center",
      autoClose: 3000,
    });
    return false;
  }
}

export const isInWishlist = (id) => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === id);
};


export const getWishlistCount = () => {
  return getWishlist().length;
};