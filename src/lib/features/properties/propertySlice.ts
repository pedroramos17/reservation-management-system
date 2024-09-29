import { Property } from "@/lib/db/idb";
import {
	addProperty,
	getProperties,
} from "@/lib/repositories/propertyRepository";
import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";

export const getPropertiesAsync = createAsyncThunk(
	"property/getProperties",
	async () => {
		const properties = await getProperties();
		return properties;
	}
);
export const addPropertyAsync = createAsyncThunk(
	"property/addProperty",
	async (property: Property) => {
		await addProperty(property);
		return property;
	}
);

type StatusType = "idle" | "fulfilled" | "loading" | "failed";

const propertyEntity = createEntityAdapter({
	selectId: (property: Property) => property.propertyId,
});

export const propertySlice = createSlice({
	name: "property",
	initialState: propertyEntity.getInitialState({
		status: "idle" as StatusType,
		error: null as string | null,
	}),
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getPropertiesAsync.pending, (state) => {
			state.status = "loading";
		});
		builder.addCase(getPropertiesAsync.rejected, (state, action) => {
			state.status = "failed";
			state.error = action.error.message || "Failed to get properties";
		});
		builder.addCase(getPropertiesAsync.fulfilled, (state, action) => {
			state.status = "fulfilled";
			propertyEntity.upsertMany(state, action.payload);
			state.error = null;
		});
		builder.addCase(addPropertyAsync.pending, (state) => {
			state.status = "loading";
		});
		builder.addCase(addPropertyAsync.rejected, (state, action) => {
			state.status = "failed";
			state.error = action.error.message || "Failed to add property";
		});
		builder.addCase(addPropertyAsync.fulfilled, (state, action) => {
			state.status = "fulfilled";
			propertyEntity.addOne(state, action.payload);
			state.error = null;
		});
	},
});

export default propertySlice.reducer;

export const { selectById: selectPropertyById } = propertyEntity.getSelectors();
