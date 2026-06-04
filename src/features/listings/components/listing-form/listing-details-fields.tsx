import { FORM_LABELS, FORM_PLACEHOLDERS } from "@/lib/constants/form"
import { BRAND, CATEGORY, CONDITION, LOCATION, SIZE, LISTING_STATUS } from "@/lib/constants"
import { Brand, Category, Condition, Location, Size, ListingStatus } from "@/types"
import { formatBrand, formatCategory, formatCondition, formatLocation, formatListingStatus } from "@/lib/formatters"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ListingDetailsFieldsProps {
  category: Category | ""
  setCategory: (value: Category | "") => void
  condition: Condition | ""
  setCondition: (value: Condition | "") => void
  price: string
  setPrice: (value: string) => void
  title: string
  setTitle: (value: string) => void
  description: string
  setDescription: (value: string) => void
  brand: Brand | ""
  setBrand: (value: Brand | "") => void
  location: Location | ""
  setLocation: (value: Location | "") => void
  size: Size | ""
  setSize: (value: Size | "") => void
  status: ListingStatus | ""
  setStatus: (value: ListingStatus | "") => void
}

export function ListingDetailsFields({
  category,
  setCategory,
  condition,
  setCondition,
  price,
  setPrice,
  title,
  setTitle,
  description,
  setDescription,
  brand,
  setBrand,
  location,
  setLocation,
  size,
  setSize,
  status,
  setStatus,
}: ListingDetailsFieldsProps) {
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 
          Category
        */}
        <div className="space-y-3">
          <Label htmlFor="category">{FORM_LABELS.category}</Label>
          <Select value={category} onValueChange={(value: Category | "") => setCategory(value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder={FORM_PLACEHOLDERS.category} />
            </SelectTrigger>
            <SelectContent className="p-2 bg-background/70 backdrop-blur-sm">
              {Object.values(CATEGORY).map((category) => (
                <SelectItem key={category} value={category}>
                  {formatCategory(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 
          Condition 
        */}
        <div className="space-y-3">
          <Label htmlFor="condition">{FORM_LABELS.condition}</Label>
          <Select value={condition} onValueChange={(value: Condition | "") => setCondition(value)}>
            <SelectTrigger id="condition">
              <SelectValue placeholder={FORM_PLACEHOLDERS.condition} />
            </SelectTrigger>
            <SelectContent className="p-2 bg-background/70 backdrop-blur-sm">
              {Object.values(CONDITION).map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {formatCondition(condition)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 
          Price 
        */}
        <div className="space-y-3">
          <Label htmlFor="price">{FORM_LABELS.price}</Label>
          <NumberInput
            id="price"
            placeholder={FORM_PLACEHOLDERS.price}
            value={price}
            onChange={setPrice}
            required
            min={0}
          />
        </div>
        {/* 
          Title 
        */}
        <div className="space-y-3 md:col-span-3 pb-3">
          <Label htmlFor="title">
            {FORM_LABELS.title}
            {category === "MOTORCYCLE" && <span className="text-muted-foreground text-xs">(Auto-generated)</span>}
          </Label>
          <Input
            id="title"
            placeholder={!category ? "Select a category first" : category === "MOTORCYCLE" ? "Auto-generated based on brand, model, and year" : FORM_PLACEHOLDERS.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            readOnly={!category || category === "MOTORCYCLE"}
            className={!category || category === "MOTORCYCLE" ? "bg-muted" : ""}
          />
        </div>
        {/* 
          Description 
        */}
        <div className="space-y-3 md:col-span-3 pb-3">
          <Label htmlFor="description">{FORM_LABELS.description}</Label>
          <Textarea
            id="description"
            placeholder={FORM_PLACEHOLDERS.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
          />
        </div>
        {/* 
          Brand 
        */}
        <div className="space-y-3">
          <Label htmlFor="brand">{FORM_LABELS.brand}</Label>
          <Select value={brand} onValueChange={(value: Brand | "") => setBrand(value)}>
            <SelectTrigger id="brand">
              <SelectValue placeholder={FORM_PLACEHOLDERS.brand} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(BRAND).map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {formatBrand(brand)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 
          Location 
        */}
        <div className="space-y-3">
          <Label htmlFor="location">{FORM_LABELS.location}</Label>
          <Select value={location} onValueChange={(value: Location | "") => setLocation(value)}>
            <SelectTrigger id="location">
              <SelectValue placeholder={FORM_PLACEHOLDERS.location} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LOCATION).map((location) => (
                <SelectItem key={location} value={location}>
                  {formatLocation(location)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 
          Status
        */}
        <div className="space-y-3">
          <Label htmlFor="status">{FORM_LABELS.status}</Label>
          <Select value={status} onValueChange={(value: ListingStatus | "") => setStatus(value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder={FORM_PLACEHOLDERS.status} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LISTING_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {formatListingStatus(s as ListingStatus)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 
          Size
        */}
        {(category === CATEGORY.HELMET ||
          category === CATEGORY.JACKET ||
          category === CATEGORY.PANTS ||
          category === CATEGORY.GLOVES ||
          category === CATEGORY.BOOTS) && (
          <div className="space-y-3">
            <Label htmlFor="size">{FORM_LABELS.size}</Label>
            <Select value={size} onValueChange={(value: Size | "") => setSize(value)}>
              <SelectTrigger id="size">
                <SelectValue placeholder={FORM_PLACEHOLDERS.size} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SIZE).map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
