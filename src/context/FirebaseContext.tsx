import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  getDocFromServer, 
  setDoc, 
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { Order, Product } from "../types";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  loyaltyPoints: number;
  createdAt: any;
  isAdmin?: boolean;
}

const getFirestoreTimestamp = (val: any) => {
  if (!val) return Timestamp.now();
  if (val instanceof Timestamp) return val;
  if (typeof val.toDate === "function") return val;
  if (val.seconds) return new Timestamp(val.seconds, val.nanoseconds || 0);
  return Timestamp.fromDate(new Date(val));
};

interface FirebaseContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  orders: Order[];
  isOrdersLoading: boolean;
  isAuthLoading: boolean;
  isOnline: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateLoyaltyPointsFirebase: (points: number) => Promise<void>;
  saveOrderToFirebase: (orderId: string, items: any[], totalPrice: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
  isAdmin: boolean;
  fetchAllOrdersForAdmin: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, userId: string, nextStatus: string) => Promise<void>;
  requestReturn: (orderId: string, userId: string, reason: string, details: string) => Promise<void>;
  products: Product[];
  isProductsLoading: boolean;
  addProductToFirebase: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProductInFirebase: (productId: number, updatedFields: Partial<Product>) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const clearAuthError = () => setAuthError(null);

  const loadProducts = async () => {
    setIsProductsLoading(true);
    try {
      const prodColRef = collection(db, "products");
      const prodSnap = await getDocs(prodColRef);
      if (prodSnap.empty) {
        console.log("Seeding products...");
        const list: Product[] = [];
        for (const p of INITIAL_PRODUCTS) {
          const stockCount = p.stockCount !== undefined ? p.stockCount : 15;
          const productToSave: Product = {
            ...p,
            stockCount
          };
          const pRef = doc(db, "products", String(p.id));
          await setDoc(pRef, productToSave);
          list.push(productToSave);
        }
        setProducts(list.sort((a, b) => a.id - b.id));
      } else {
        const list: Product[] = [];
        prodSnap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: Number(data.id),
            name: String(data.name || ""),
            price: Number(data.price || 0),
            category: data.category || "exterior",
            categoryLabel: String(data.categoryLabel || ""),
            icon: String(data.icon || ""),
            image: data.image || "",
            description: String(data.description || ""),
            fullDescription: String(data.fullDescription || ""),
            rating: Number(data.rating || 5),
            reviewsCount: Number(data.reviewsCount || 0),
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            instructions: String(data.instructions || ""),
            size: String(data.size || ""),
            inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
            isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
            stockCount: data.stockCount !== undefined ? Number(data.stockCount) : 15
          });
        });
        setProducts(list.sort((a, b) => a.id - b.id));
      }
    } catch (err: any) {
      console.warn("Could not retrieve/seed products from Firestore, using offline fallback:", err);
      setProducts(INITIAL_PRODUCTS.map(p => ({
        ...p,
        stockCount: p.stockCount !== undefined ? p.stockCount : 15
      })));
    } finally {
      setIsProductsLoading(false);
    }
  };

  const addProductToFirebase = async (newProd: Omit<Product, 'id'>) => {
    try {
      const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
      const nextId = maxId + 1;
      const productToSave: Product = {
        ...newProd,
        id: nextId
      };
      const prodPath = `products/${nextId}`;
      const prodRef = doc(db, "products", String(nextId));
      await setDoc(prodRef, productToSave);
      
      setProducts(prev => [...prev, productToSave].sort((a,b) => a.id - b.id));
    } catch (err: any) {
      console.warn("Could not save product to Firestore:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.WRITE, `products/${products.length + 1}`);
      }
      throw err;
    }
  };

  const updateProductInFirebase = async (productId: number, updatedFields: Partial<Product>) => {
    try {
      const prodPath = `products/${productId}`;
      const prodRef = doc(db, "products", String(productId));
      await updateDoc(prodRef, updatedFields);
      
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedFields } as Product : p));
    } catch (err: any) {
      console.warn(`Could not update product ${productId} in Firestore:`, err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.WRITE, `products/${productId}`);
      }
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Helper/Robust order loading mechanism
  const loadUserOrders = async (userId: string) => {
    setIsOrdersLoading(true);
    const path = `users/${userId}/purchases`;
    try {
      const q = collection(db, "users", userId, "purchases");
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedOrders.push({
          orderId: data.orderId || docSnap.id,
          userId: data.userId || userId,
          items: (data.items || []).map((item: any) => ({
            productId: Number(item.productId),
            name: String(item.name || "Detailing Product"),
            quantity: Number(item.quantity || 1),
            price: Number(item.price || 0)
          })),
          totalPrice: Number(data.totalPrice || 0),
          status: String(data.status || "pending"),
          createdAt: data.createdAt?.toDate 
            ? data.createdAt.toDate().toISOString() 
            : (data.createdAt || new Date().toISOString()),
          returnReason: data.returnReason ? String(data.returnReason) : undefined,
          returnDetails: data.returnDetails ? String(data.returnDetails) : undefined
        });
      });

      // Sort descending client-side
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetchedOrders);
      localStorage.setItem(`idetail-orders-${userId}`, JSON.stringify(fetchedOrders));
    } catch (err: any) {
      console.warn("Could not retrieve orders from Firestore. Fallback to localStorage:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.GET, path);
      }
      const cached = localStorage.getItem(`idetail-orders-${userId}`);
      if (cached) {
        try {
          setOrders(JSON.parse(cached));
        } catch {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (currentUser) {
      await loadUserOrders(currentUser.uid);
    } else {
      const cachedGuest = localStorage.getItem("idetail-orders-guest_detailing_client");
      if (cachedGuest) {
        try {
          setOrders(JSON.parse(cachedGuest));
        } catch {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    }
  };

  // 1. Connection Validation On Initial Application Boot
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Auth State Changed Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const localSaved = localStorage.getItem("idetail-loyalty-points");
        const initialPoints = localSaved ? parseInt(localSaved, 10) : 1240;

        let hasAdminDocument = false;
        if (user.email?.toLowerCase() === "riyaadryklief92@gmail.com") {
          try {
            const adminDocRef = doc(db, "admins", user.uid);
            const adminSnap = await getDoc(adminDocRef);
            if (!adminSnap.exists()) {
              await setDoc(adminDocRef, {
                uid: user.uid,
                email: user.email,
                assignedAt: new Date().toISOString()
              });
            }
            hasAdminDocument = true;
          } catch (admErr) {
            console.warn("Could not bootstrap admin doc in Firebase:", admErr);
          }
        }

        // Load or create User Profile
        const profilePath = `users/${user.uid}`;
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              uid: data.uid || user.uid,
              email: data.email || user.email || "",
              displayName: data.displayName || user.displayName || "iDetail Professional",
              loyaltyPoints: Number(data.loyaltyPoints || initialPoints),
              createdAt: data.createdAt,
              isAdmin: hasAdminDocument || user.email?.toLowerCase() === "riyaadryklief92@gmail.com"
            });
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "iDetail Professional",
              loyaltyPoints: initialPoints,
              createdAt: new Date().toISOString(),
              isAdmin: hasAdminDocument || user.email?.toLowerCase() === "riyaadryklief92@gmail.com"
            };

            try {
              await setDoc(docRef, {
                uid: newProfile.uid,
                email: newProfile.email,
                displayName: newProfile.displayName,
                loyaltyPoints: newProfile.loyaltyPoints,
                createdAt: serverTimestamp()
              });
            } catch (writeErr: any) {
              console.warn("Could not save initial profile to Firestore:", writeErr);
              if (writeErr instanceof Error && writeErr.message.toLowerCase().includes("permission")) {
                handleFirestoreError(writeErr, OperationType.WRITE, profilePath);
              }
            }
            setUserProfile(newProfile);
          }
        } catch (err: any) {
          console.warn("Firestore profile get failed (client likely offline or DB un-provisioned). Using local fallback:", err);
          if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
            handleFirestoreError(err, OperationType.GET, profilePath);
          }
          setIsOnline(false);
          // High quality offline fallback profile using local state
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "iDetail Professional",
            loyaltyPoints: initialPoints,
            createdAt: new Date().toISOString(),
            isAdmin: hasAdminDocument || user.email?.toLowerCase() === "riyaadryklief92@gmail.com"
          };
          setUserProfile(fallbackProfile);
        }

        // Fetch orders for active user
        await loadUserOrders(user.uid);
      } else {
        setUserProfile(null);
        // Load guest's cached orders (if any)
        const cachedGuest = localStorage.getItem("idetail-orders-guest_detailing_client");
        if (cachedGuest) {
          try {
            setOrders(JSON.parse(cachedGuest));
          } catch {
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Authenticate with Google
  const signInWithGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google sign-in popup closed or failed:", err);
      if (err?.code === "auth/popup-closed-by-user") {
        setAuthError("POPUP_CLOSED_BY_USER");
      } else if (err?.code === "auth/blocked-by-popup-blocker") {
        setAuthError("BLOCKED_BY_POPUP_BLOCKER");
      } else if (err?.code === "auth/cancelled-popup-request") {
        setAuthError("CANCELLED_POPUP_REQUEST");
      } else if (err?.code === "auth/unauthorized-domain") {
        setAuthError("UNAUTHORIZED_DOMAIN");
      } else if (err?.message && err.message.includes("unauthorized-domain")) {
        setAuthError("UNAUTHORIZED_DOMAIN");
      } else {
        setAuthError(err?.message || "Authentication failed");
      }
    }
  };

  // 4. Log out callback
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  // 5. Update Loyalty Points
  const updateLoyaltyPointsFirebase = async (addedPoints: number) => {
    if (!currentUser || !userProfile) return;
    const nextPoints = userProfile.loyaltyPoints + addedPoints;
    const path = `users/${currentUser.uid}`;

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, {
        uid: userProfile.uid,
        email: userProfile.email,
        displayName: userProfile.displayName,
        loyaltyPoints: nextPoints,
        createdAt: getFirestoreTimestamp(userProfile.createdAt)
      });
      setUserProfile(prev => prev ? { ...prev, loyaltyPoints: nextPoints } : null);
    } catch (err: any) {
      console.warn("Could not sync loyalty points to Firestore, fallback to local storage:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
      setUserProfile(prev => prev ? { ...prev, loyaltyPoints: nextPoints } : null);
      localStorage.setItem("idetail-loyalty-points", nextPoints.toString());
    }
  };

  // 6. Save Checkout Order
  const saveOrderToFirebase = async (orderId: string, items: any[], totalPrice: number) => {
    const formattedItems = items.map(item => ({
      productId: Number(item.product.id),
      name: String(item.product.name),
      quantity: Number(item.quantity),
      price: Number(item.product.price)
    }));

    const userId = currentUser?.uid || "guest_detailing_client";
    const newOrder: Order = {
      orderId,
      userId,
      items: formattedItems,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Update in-memory state dynamically & save locally for instant feedback
    setOrders(prev => {
      const nextList = [newOrder, ...prev];
      localStorage.setItem(`idetail-orders-${userId}`, JSON.stringify(nextList));
      return nextList;
    });

    // A. Store in global orders collection (Unified central DB for all customer orders)
    const globalOrderPath = `orders/${orderId}`;
    try {
      const globalOrderRef = doc(db, "orders", orderId);
      await setDoc(globalOrderRef, {
        orderId,
        userId,
        items: formattedItems,
        totalPrice,
        status: "pending",
        createdAt: serverTimestamp()
      });
    } catch (err: any) {
      console.warn("Could not save checkout order to global orders in Firestore:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.WRITE, globalOrderPath);
      }
    }

    // B. Store under user's purchases profile subcollection if signed in
    if (currentUser) {
      const userPath = `users/${userId}/purchases/${orderId}`;
      try {
        const orderDocRef = doc(db, "users", userId, "purchases", orderId);
        await setDoc(orderDocRef, {
          orderId,
          userId,
          items: formattedItems,
          totalPrice,
          status: "pending",
          createdAt: serverTimestamp()
        });
      } catch (err: any) {
        console.warn("Could not sync checkout order to user profile purchases collection:", err);
        if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
      }
    }

    // C. Decrement stock on hand for each item in the order
    for (const item of items) {
      const pId = Number(item.productId || (item.product && item.product.id));
      const qSelected = Number(item.quantity);
      if (pId) {
        const matchingProduct = products.find(p => p.id === pId);
        if (matchingProduct) {
          const nextStock = Math.max(0, (matchingProduct.stockCount || 15) - qSelected);
          const nextInStock = nextStock > 0;
          try {
            const prodRef = doc(db, "products", String(pId));
            await updateDoc(prodRef, {
              stockCount: nextStock,
              inStock: nextInStock
            });
            // Update client-side local products state
            setProducts(prev => prev.map(p => p.id === pId ? { ...p, stockCount: nextStock, inStock: nextInStock } : p));
          } catch (stkErr) {
            console.warn(`Could not update stock counts for product ${pId}:`, stkErr);
          }
        }
      }
    }
  };

  // 6.5 Admin Specific Methods
  const fetchAllOrdersForAdmin = async (): Promise<Order[]> => {
    try {
      const q = collection(db, "orders");
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let formattedDate = "";
        try {
          if (data.createdAt) {
            if (data.createdAt.toDate) {
              formattedDate = data.createdAt.toDate().toISOString();
            } else if (data.createdAt.seconds) {
              formattedDate = new Date(data.createdAt.seconds * 1000).toISOString();
            } else {
              formattedDate = new Date(data.createdAt).toISOString();
            }
          } else {
            formattedDate = new Date().toISOString();
          }
        } catch {
          formattedDate = new Date().toISOString();
        }

        fetchedOrders.push({
          orderId: data.orderId || docSnap.id,
          userId: data.userId || "anonymous",
          items: (data.items || []).map((item: any) => ({
            productId: Number(item.productId || 0),
            name: String(item.name || "Product Formula"),
            quantity: Number(item.quantity || 1),
            price: Number(item.price || 0)
          })),
          totalPrice: Number(data.totalPrice || 0),
          status: String(data.status || "pending"),
          createdAt: formattedDate,
          returnReason: data.returnReason ? String(data.returnReason) : undefined,
          returnDetails: data.returnDetails ? String(data.returnDetails) : undefined
        });
      });
      // Sort descending by date
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return fetchedOrders;
    } catch (err: any) {
      console.error("Could not fetch all orders:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.GET, "orders");
      }
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, userId: string, nextStatus: string) => {
    const globalOrderPath = `orders/${orderId}`;
    try {
      // A. Update in the global orders collection
      const globalOrderRef = doc(db, "orders", orderId);
      await updateDoc(globalOrderRef, {
        status: nextStatus
      });

      // B. Update under user's purchases profile subcollection if registered user
      if (userId && userId !== "guest_detailing_client") {
        const orderDocRef = doc(db, "users", userId, "purchases", orderId);
        await updateDoc(orderDocRef, {
          status: nextStatus
        });
      }

      // Local updates
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: nextStatus } : o));
    } catch (err: any) {
      console.error("Failed to update order status:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.WRITE, globalOrderPath);
      }
      throw err;
    }
  };

  const requestReturn = async (orderId: string, userId: string, reason: string, details: string) => {
    const globalOrderPath = `orders/${orderId}`;
    try {
      // A. Update in the global orders collection
      const globalOrderRef = doc(db, "orders", orderId);
      await updateDoc(globalOrderRef, {
        status: "return_requested",
        returnReason: reason,
        returnDetails: details
      });

      // B. Update under user's purchases profile subcollection if registered user
      if (userId && userId !== "guest_detailing_client") {
        const orderDocRef = doc(db, "users", userId, "purchases", orderId);
        await updateDoc(orderDocRef, {
          status: "return_requested",
          returnReason: reason,
          returnDetails: details
        });
      }

      // Local updates
      setOrders(prev => prev.map(o => o.orderId === orderId ? { 
        ...o, 
        status: "return_requested",
        returnReason: reason,
        returnDetails: details 
      } : o));
    } catch (err: any) {
      console.error("Failed to request return in Firestore:", err);
      // Fallback for guest or offline mode
      if (userId === "guest_detailing_client" || !currentUser) {
        setOrders(prev => {
          const next = prev.map(o => o.orderId === orderId ? { 
            ...o, 
            status: "return_requested",
            returnReason: reason,
            returnDetails: details 
          } : o);
          localStorage.setItem(`idetail-orders-${userId}`, JSON.stringify(next));
          return next;
        });
        return;
      }
      if (err instanceof Error && err.message.toLowerCase().includes("permission")) {
        handleFirestoreError(err, OperationType.WRITE, globalOrderPath);
      }
      throw err;
    }
  };

  // 7. Email Sign In
  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error("Email sign-in failed:", err);
      setAuthError(err?.message || "Invalid email or password");
      throw err;
    }
  };

  // 8. Email Sign Up / Registration
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCred.user, {
        displayName: name
      });
      
      // Explicitly pre-create user profile in database to guarantee instant sync
      const profilePath = `users/${userCred.user.uid}`;
      const docRef = doc(db, "users", userCred.user.uid);
      const newProfile: UserProfile = {
        uid: userCred.user.uid,
        email: email,
        displayName: name,
        loyaltyPoints: 1240, // Base default loyalty points
        createdAt: new Date().toISOString()
      };
      
      try {
        await setDoc(docRef, {
          uid: newProfile.uid,
          email: newProfile.email,
          displayName: newProfile.displayName,
          loyaltyPoints: newProfile.loyaltyPoints,
          createdAt: serverTimestamp()
        });
      } catch (writeErr: any) {
        console.warn("Could not save initial profile to Firestore on email signup:", writeErr);
        if (writeErr instanceof Error && writeErr.message.toLowerCase().includes("permission")) {
          handleFirestoreError(writeErr, OperationType.WRITE, profilePath);
        }
      }
      setUserProfile(newProfile);
    } catch (err: any) {
      console.error("Email registration failed:", err);
      setAuthError(err?.message || "Registration failed. Please check credentials.");
      throw err;
    }
  };

  const isAdmin = userProfile?.isAdmin === true || currentUser?.email?.toLowerCase() === "riyaadryklief92@gmail.com";

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        userProfile,
        orders,
        isOrdersLoading,
        isAuthLoading,
        isOnline,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateLoyaltyPointsFirebase,
        saveOrderToFirebase,
        refreshOrders,
        isAdmin,
        fetchAllOrdersForAdmin,
        updateOrderStatus,
        requestReturn,
        products,
        isProductsLoading,
        addProductToFirebase,
        updateProductInFirebase,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
