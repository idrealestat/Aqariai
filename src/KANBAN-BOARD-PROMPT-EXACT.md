# 🎯 برومبت نظام Kanban Board - التوثيق الحرفي الكامل

## للذكاء الاصطناعي الآخر: اقرأ هذا البرومبت حرفياً بدون أي إضافة أو تحسين

---

# 📋 المطلوب:

نظام **Kanban Board** كامل مع دعم السحب والإفلات (Drag & Drop) للبطاقات والأعمدة على:
- **الجوال (Mobile)** - باللمس
- **الكمبيوتر (Desktop)** - بالماوس

---

# 🏗️ الهيكل الأساسي:

## 1️⃣ الأعمدة (Columns):

```typescript
interface Column {
  id: string;
  title: string;
  color: string;
  cards: Card[];
  order: number; // ترتيب العمود
}
```

**مثال:**
```typescript
const columns: Column[] = [
  { id: 'col-1', title: 'قيد الانتظار', color: '#FFA500', cards: [], order: 0 },
  { id: 'col-2', title: 'قيد التنفيذ', color: '#4169E1', cards: [], order: 1 },
  { id: 'col-3', title: 'مكتمل', color: '#228B22', cards: [], order: 2 }
];
```

## 2️⃣ البطاقات (Cards):

```typescript
interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string; // العمود الذي تنتمي له البطاقة
  order: number; // ترتيب البطاقة داخل العمود
}
```

**مثال:**
```typescript
const card: Card = {
  id: 'card-1',
  title: 'مهمة رقم 1',
  description: 'وصف المهمة',
  columnId: 'col-1',
  order: 0
};
```

---

# 🖱️ السحب والإفلات للبطاقات (Card Drag & Drop):

## على الكمبيوتر (Desktop):

### أ. بداية السحب (dragStart):

```typescript
const handleCardDragStart = (e: React.DragEvent, card: Card) => {
  // 1. تخزين بيانات البطاقة المسحوبة
  e.dataTransfer.setData('cardId', card.id);
  e.dataTransfer.setData('sourceColumnId', card.columnId);
  
  // 2. تعيين تأثير السحب
  e.dataTransfer.effectAllowed = 'move';
  
  // 3. إضافة class للبطاقة المسحوبة
  (e.target as HTMLElement).classList.add('dragging');
  
  // 4. حفظ البطاقة المسحوبة في state
  setDraggedCard(card);
};
```

**التطبيق على البطاقة:**
```tsx
<div
  draggable={true}
  onDragStart={(e) => handleCardDragStart(e, card)}
  className="card"
>
  {card.title}
</div>
```

### ب. أثناء السحب (dragOver):

```typescript
const handleCardDragOver = (e: React.DragEvent, targetCard: Card) => {
  e.preventDefault(); // ضروري للسماح بالإفلات
  e.stopPropagation();
  
  // تحديد الموضع النسبي للماوس
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const mouseY = e.clientY;
  const cardMiddle = rect.top + rect.height / 2;
  
  // تحديد: هل الماوس في النصف العلوي أم السفلي من البطاقة؟
  const dropPosition = mouseY < cardMiddle ? 'before' : 'after';
  
  // حفظ موضع الإفلات
  setDropIndicator({
    cardId: targetCard.id,
    position: dropPosition
  });
};
```

**التطبيق على البطاقة:**
```tsx
<div
  onDragOver={(e) => handleCardDragOver(e, card)}
  className="card"
>
  {/* إظهار الخط الأزرق حسب الموضع */}
  {dropIndicator?.cardId === card.id && dropIndicator?.position === 'before' && (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-50" />
  )}
  
  {card.title}
  
  {dropIndicator?.cardId === card.id && dropIndicator?.position === 'after' && (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-50" />
  )}
</div>
```

### ج. الإفلات (drop):

```typescript
const handleCardDrop = (e: React.DragEvent, targetCard: Card) => {
  e.preventDefault();
  e.stopPropagation();
  
  // 1. استخراج بيانات البطاقة المسحوبة
  const cardId = e.dataTransfer.getData('cardId');
  const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
  
  // 2. العثور على البطاقة المسحوبة
  const draggedCard = findCardById(cardId);
  if (!draggedCard) return;
  
  // 3. تحديد العمود الهدف
  const targetColumnId = targetCard.columnId;
  
  // 4. تحديد الترتيب الجديد
  const dropPosition = dropIndicator?.position || 'after';
  const newOrder = dropPosition === 'before' 
    ? targetCard.order 
    : targetCard.order + 1;
  
  // 5. نقل البطاقة
  moveCard(draggedCard.id, sourceColumnId, targetColumnId, newOrder);
  
  // 6. مسح المؤشرات
  setDraggedCard(null);
  setDropIndicator(null);
};
```

### د. نهاية السحب (dragEnd):

```typescript
const handleCardDragEnd = (e: React.DragEvent) => {
  // 1. إزالة class من البطاقة
  (e.target as HTMLElement).classList.remove('dragging');
  
  // 2. مسح المؤشرات
  setDraggedCard(null);
  setDropIndicator(null);
};
```

**التطبيق الكامل على البطاقة:**
```tsx
<div
  draggable={true}
  onDragStart={(e) => handleCardDragStart(e, card)}
  onDragOver={(e) => handleCardDragOver(e, card)}
  onDrop={(e) => handleCardDrop(e, card)}
  onDragEnd={(e) => handleCardDragEnd(e)}
  className={`card ${draggedCard?.id === card.id ? 'opacity-50' : ''}`}
>
  {/* الخط الأزرق العلوي */}
  {dropIndicator?.cardId === card.id && dropIndicator?.position === 'before' && (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-lg z-50" />
  )}
  
  {card.title}
  
  {/* الخط الأزرق السفلي */}
  {dropIndicator?.cardId === card.id && dropIndicator?.position === 'after' && (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-lg z-50" />
  )}
</div>
```

---

## على الجوال (Mobile):

### باستخدام Touch Events:

```typescript
// State لتتبع اللمس
const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
const [touchCurrent, setTouchCurrent] = useState<{ x: number; y: number } | null>(null);
const [isDragging, setIsDragging] = useState(false);

// أ. بداية اللمس
const handleTouchStart = (e: React.TouchEvent, card: Card) => {
  const touch = e.touches[0];
  setTouchStart({ x: touch.clientX, y: touch.clientY });
  setDraggedCard(card);
};

// ب. أثناء اللمس والتحريك
const handleTouchMove = (e: React.TouchEvent) => {
  if (!touchStart || !draggedCard) return;
  
  const touch = e.touches[0];
  setTouchCurrent({ x: touch.clientX, y: touch.clientY });
  
  // تفعيل وضع السحب بعد تحريك 5px على الأقل
  const deltaX = Math.abs(touch.clientX - touchStart.x);
  const deltaY = Math.abs(touch.clientY - touchStart.y);
  
  if (deltaX > 5 || deltaY > 5) {
    setIsDragging(true);
  }
  
  // العثور على البطاقة/العمود أسفل الإصبع
  const elementUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);
  
  if (elementUnderFinger) {
    // معالجة Drop Indicator بنفس طريقة Desktop
    const cardElement = elementUnderFinger.closest('[data-card-id]');
    if (cardElement) {
      const targetCardId = cardElement.getAttribute('data-card-id');
      const targetCard = findCardById(targetCardId);
      
      if (targetCard) {
        const rect = cardElement.getBoundingClientRect();
        const fingerY = touch.clientY;
        const cardMiddle = rect.top + rect.height / 2;
        
        setDropIndicator({
          cardId: targetCard.id,
          position: fingerY < cardMiddle ? 'before' : 'after'
        });
      }
    }
  }
};

// ج. نهاية اللمس
const handleTouchEnd = (e: React.TouchEvent) => {
  if (!isDragging || !draggedCard || !dropIndicator) {
    // إلغاء السحب
    setDraggedCard(null);
    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
    setDropIndicator(null);
    return;
  }
  
  // تنفيذ الإفلات
  const targetCard = findCardById(dropIndicator.cardId);
  if (targetCard) {
    const newOrder = dropIndicator.position === 'before' 
      ? targetCard.order 
      : targetCard.order + 1;
    
    moveCard(draggedCard.id, draggedCard.columnId, targetCard.columnId, newOrder);
  }
  
  // مسح المؤشرات
  setDraggedCard(null);
  setTouchStart(null);
  setTouchCurrent(null);
  setIsDragging(false);
  setDropIndicator(null);
};
```

**التطبيق على البطاقة (Mobile):**
```tsx
<div
  data-card-id={card.id}
  onTouchStart={(e) => handleTouchStart(e, card)}
  onTouchMove={(e) => handleTouchMove(e)}
  onTouchEnd={(e) => handleTouchEnd(e)}
  className={`card ${draggedCard?.id === card.id && isDragging ? 'opacity-50 scale-105' : ''}`}
  style={{
    // عرض البطاقة تحت الإصبع أثناء السحب
    ...(draggedCard?.id === card.id && isDragging && touchCurrent ? {
      position: 'fixed',
      left: touchCurrent.x - 100, // تعديل حسب عرض البطاقة
      top: touchCurrent.y - 50,   // تعديل حسب ارتفاع البطاقة
      zIndex: 1000,
      pointerEvents: 'none'
    } : {})
  }}
>
  {/* الخط الأزرق */}
  {dropIndicator?.cardId === card.id && dropIndicator?.position === 'before' && (
    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-lg z-50 rounded-full" />
  )}
  
  {card.title}
  
  {dropIndicator?.cardId === card.id && dropIndicator?.position === 'after' && (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-lg z-50 rounded-full" />
  )}
</div>
```

---

# 🔄 السحب والإفلات للأعمدة (Column Drag & Drop):

## على الكمبيوتر (Desktop):

### أ. بداية السحب:

```typescript
const handleColumnDragStart = (e: React.DragEvent, column: Column) => {
  e.dataTransfer.setData('columnId', column.id);
  e.dataTransfer.effectAllowed = 'move';
  
  setDraggedColumn(column);
  
  // منع سحب البطاقات داخل العمود أثناء سحب العمود نفسه
  e.stopPropagation();
};
```

### ب. أثناء السحب:

```typescript
const handleColumnDragOver = (e: React.DragEvent, targetColumn: Column) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!draggedColumn || draggedColumn.id === targetColumn.id) return;
  
  // تحديد الموضع النسبي
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const mouseX = e.clientX;
  const columnMiddle = rect.left + rect.width / 2;
  
  // يمين أو يسار؟
  const dropPosition = mouseX < columnMiddle ? 'before' : 'after';
  
  setColumnDropIndicator({
    columnId: targetColumn.id,
    position: dropPosition
  });
};
```

### ج. الإفلات:

```typescript
const handleColumnDrop = (e: React.DragEvent, targetColumn: Column) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!draggedColumn || !columnDropIndicator) return;
  
  // حساب الترتيب الجديد
  const newOrder = columnDropIndicator.position === 'before'
    ? targetColumn.order
    : targetColumn.order + 1;
  
  // إعادة ترتيب الأعمدة
  reorderColumns(draggedColumn.id, newOrder);
  
  // مسح المؤشرات
  setDraggedColumn(null);
  setColumnDropIndicator(null);
};
```

**التطبيق على العمود:**
```tsx
<div
  draggable={true}
  onDragStart={(e) => handleColumnDragStart(e, column)}
  onDragOver={(e) => handleColumnDragOver(e, column)}
  onDrop={(e) => handleColumnDrop(e, column)}
  onDragEnd={() => {
    setDraggedColumn(null);
    setColumnDropIndicator(null);
  }}
  className={`column ${draggedColumn?.id === column.id ? 'opacity-50' : ''}`}
>
  {/* الخط العمودي الأزرق (يسار) */}
  {columnDropIndicator?.columnId === column.id && columnDropIndicator?.position === 'before' && (
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-lg z-50 rounded-full" />
  )}
  
  <div className="column-header">
    <h3>{column.title}</h3>
  </div>
  
  <div className="column-body">
    {column.cards.map(card => (
      <Card key={card.id} card={card} />
    ))}
  </div>
  
  {/* الخط العمودي الأزرق (يمين) */}
  {columnDropIndicator?.columnId === column.id && columnDropIndicator?.position === 'after' && (
    <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 shadow-lg z-50 rounded-full" />
  )}
</div>
```

---

## على الجوال (Mobile):

```typescript
const handleColumnTouchStart = (e: React.TouchEvent, column: Column) => {
  const touch = e.touches[0];
  setColumnTouchStart({ x: touch.clientX, y: touch.clientY });
  setDraggedColumn(column);
};

const handleColumnTouchMove = (e: React.TouchEvent) => {
  if (!columnTouchStart || !draggedColumn) return;
  
  const touch = e.touches[0];
  setColumnTouchCurrent({ x: touch.clientX, y: touch.clientY });
  
  const deltaX = Math.abs(touch.clientX - columnTouchStart.x);
  
  if (deltaX > 10) {
    setIsColumnDragging(true);
  }
  
  // العثور على العمود أسفل الإصبع
  const elementUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);
  const columnElement = elementUnderFinger?.closest('[data-column-id]');
  
  if (columnElement) {
    const targetColumnId = columnElement.getAttribute('data-column-id');
    const targetColumn = findColumnById(targetColumnId);
    
    if (targetColumn && targetColumn.id !== draggedColumn.id) {
      const rect = columnElement.getBoundingClientRect();
      const fingerX = touch.clientX;
      const columnMiddle = rect.left + rect.width / 2;
      
      setColumnDropIndicator({
        columnId: targetColumn.id,
        position: fingerX < columnMiddle ? 'before' : 'after'
      });
    }
  }
};

const handleColumnTouchEnd = () => {
  if (!isColumnDragging || !draggedColumn || !columnDropIndicator) {
    // إلغاء
    setDraggedColumn(null);
    setColumnTouchStart(null);
    setColumnTouchCurrent(null);
    setIsColumnDragging(false);
    setColumnDropIndicator(null);
    return;
  }
  
  // تنفيذ الإفلات
  const targetColumn = findColumnById(columnDropIndicator.columnId);
  if (targetColumn) {
    const newOrder = columnDropIndicator.position === 'before'
      ? targetColumn.order
      : targetColumn.order + 1;
    
    reorderColumns(draggedColumn.id, newOrder);
  }
  
  // مسح
  setDraggedColumn(null);
  setColumnTouchStart(null);
  setColumnTouchCurrent(null);
  setIsColumnDragging(false);
  setColumnDropIndicator(null);
};
```

---

# 🎨 الخط الأزرق (Drop Indicator):

## للبطاقات (أفقي):

### فوق البطاقة (before):
```tsx
<div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-blue-500 shadow-lg shadow-blue-500/50 z-50 rounded-full" />
```

### تحت البطاقة (after):
```tsx
<div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-blue-500 shadow-lg shadow-blue-500/50 z-50 rounded-full" />
```

## للأعمدة (عمودي):

### يسار العمود (before):
```tsx
<div className="absolute left-0 top-0 bottom-0 w-0.5 md:w-1 bg-blue-500 shadow-lg shadow-blue-500/50 z-50 rounded-full" />
```

### يمين العمود (after):
```tsx
<div className="absolute right-0 top-0 bottom-0 w-0.5 md:w-1 bg-blue-500 shadow-lg shadow-blue-500/50 z-50 rounded-full" />
```

## التأثيرات البصرية:

### البطاقة أثناء السحب:
```css
.card.dragging {
  opacity: 0.5;
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  cursor: grabbing;
}
```

### العمود أثناء السحب:
```css
.column.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
  cursor: grabbing;
}
```

---

# 🔧 الدوال المساعدة:

## 1. نقل بطاقة:

```typescript
const moveCard = (
  cardId: string, 
  sourceColumnId: string, 
  targetColumnId: string, 
  newOrder: number
) => {
  setColumns(prevColumns => {
    const newColumns = [...prevColumns];
    
    // 1. العثور على العمود المصدر والهدف
    const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
    const targetColumn = newColumns.find(col => col.id === targetColumnId);
    
    if (!sourceColumn || !targetColumn) return prevColumns;
    
    // 2. العثور على البطاقة وإزالتها من المصدر
    const cardIndex = sourceColumn.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return prevColumns;
    
    const [card] = sourceColumn.cards.splice(cardIndex, 1);
    
    // 3. تحديث columnId للبطاقة
    card.columnId = targetColumnId;
    
    // 4. إضافة البطاقة للعمود الهدف في الموضع الجديد
    targetColumn.cards.splice(newOrder, 0, card);
    
    // 5. إعادة ترتيب جميع البطاقات في العمودين
    sourceColumn.cards.forEach((c, i) => c.order = i);
    targetColumn.cards.forEach((c, i) => c.order = i);
    
    return newColumns;
  });
};
```

## 2. إعادة ترتيب الأعمدة:

```typescript
const reorderColumns = (columnId: string, newOrder: number) => {
  setColumns(prevColumns => {
    const newColumns = [...prevColumns];
    
    // 1. العثور على العمود
    const columnIndex = newColumns.findIndex(col => col.id === columnId);
    if (columnIndex === -1) return prevColumns;
    
    // 2. إزالة العمود من موضعه القديم
    const [column] = newColumns.splice(columnIndex, 1);
    
    // 3. إدراجه في الموضع الجديد
    newColumns.splice(newOrder, 0, column);
    
    // 4. إعادة ترتيب جميع الأعمدة
    newColumns.forEach((col, i) => col.order = i);
    
    return newColumns;
  });
};
```

## 3. الإفلات في منطقة فارغة (في العمود):

```typescript
const handleColumnAreaDrop = (e: React.DragEvent, columnId: string) => {
  e.preventDefault();
  
  if (!draggedCard) return;
  
  // الإفلات في نهاية العمود
  const column = columns.find(col => col.id === columnId);
  if (!column) return;
  
  const newOrder = column.cards.length; // آخر موضع
  
  moveCard(draggedCard.id, draggedCard.columnId, columnId, newOrder);
  
  setDraggedCard(null);
  setDropIndicator(null);
};
```

**التطبيق على منطقة العمود:**
```tsx
<div
  className="column-body min-h-[200px]"
  onDragOver={(e) => {
    e.preventDefault();
    // إظهار مؤشر في نهاية العمود
    setDropIndicator({
      cardId: 'column-end',
      position: 'after',
      columnId: column.id
    });
  }}
  onDrop={(e) => handleColumnAreaDrop(e, column.id)}
>
  {column.cards.length === 0 && (
    <div className="text-center text-gray-400 py-8">
      اسحب البطاقات هنا
    </div>
  )}
  
  {column.cards.map(card => (
    <Card key={card.id} card={card} />
  ))}
  
  {/* خط أزرق في نهاية العمود الفارغ أو بعد آخر بطاقة */}
  {dropIndicator?.columnId === column.id && dropIndicator?.cardId === 'column-end' && (
    <div className="w-full h-1 bg-blue-500 rounded-full shadow-lg mt-2" />
  )}
</div>
```

---

# 📱 التمرير الأفقي (Horizontal Scrolling):

## على الجوال:

```tsx
<div className="kanban-container overflow-x-auto overflow-y-hidden">
  <div className="flex gap-4 p-4 min-w-max">
    {columns.map(column => (
      <div 
        key={column.id} 
        className="column w-80 flex-shrink-0"
      >
        {/* محتوى العمود */}
      </div>
    ))}
  </div>
</div>
```

**CSS:**
```css
.kanban-container {
  /* تمكين التمرير السلس */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* إخفاء شريط التمرير على الجوال */
.kanban-container::-webkit-scrollbar {
  display: none;
}

.kanban-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## التمرير التلقائي عند السحب قرب الحافة:

```typescript
const handleAutoScroll = (e: React.DragEvent | React.TouchEvent) => {
  const container = document.querySelector('.kanban-container');
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  let clientX: number;
  
  if ('touches' in e) {
    clientX = e.touches[0].clientX;
  } else {
    clientX = e.clientX;
  }
  
  const scrollSpeed = 10;
  const edgeThreshold = 100; // 100px من الحافة
  
  // التمرير لليسار
  if (clientX < rect.left + edgeThreshold) {
    container.scrollLeft -= scrollSpeed;
  }
  
  // التمرير لليمين
  if (clientX > rect.right - edgeThreshold) {
    container.scrollLeft += scrollSpeed;
  }
};
```

**الدمج في handleDragOver و handleTouchMove:**
```typescript
const handleCardDragOver = (e: React.DragEvent, card: Card) => {
  e.preventDefault();
  
  // ... الكود السابق
  
  // إضافة التمرير التلقائي
  handleAutoScroll(e);
};
```

---

# 🎯 State الكامل المطلوب:

```typescript
// البيانات الأساسية
const [columns, setColumns] = useState<Column[]>([]);

// للبطاقات
const [draggedCard, setDraggedCard] = useState<Card | null>(null);
const [dropIndicator, setDropIndicator] = useState<{
  cardId: string;
  position: 'before' | 'after';
  columnId?: string;
} | null>(null);

// للأعمدة
const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
const [columnDropIndicator, setColumnDropIndicator] = useState<{
  columnId: string;
  position: 'before' | 'after';
} | null>(null);

// للجوال (البطاقات)
const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
const [touchCurrent, setTouchCurrent] = useState<{ x: number; y: number } | null>(null);
const [isDragging, setIsDragging] = useState(false);

// للجوال (الأعمدة)
const [columnTouchStart, setColumnTouchStart] = useState<{ x: number; y: number } | null>(null);
const [columnTouchCurrent, setColumnTouchCurrent] = useState<{ x: number; y: number } | null>(null);
const [isColumnDragging, setIsColumnDragging] = useState(false);
```

---

# ✅ الخلاصة:

## ما يجب تنفيذه بالضبط:

### 1. للبطاقات:
- ✅ سحب بالماوس (Desktop) - 4 events
- ✅ سحب باللمس (Mobile) - 3 events
- ✅ خط أزرق أفقي (فوق/تحت البطاقة)
- ✅ تأثيرات بصرية (opacity + scale)
- ✅ نقل بين الأعمدة
- ✅ إعادة ترتيب داخل نفس العمود

### 2. للأعمدة:
- ✅ سحب بالماوس (Desktop) - 4 events
- ✅ سحب باللمس (Mobile) - 3 events
- ✅ خط أزرق عمودي (يسار/يمين العمود)
- ✅ تأثيرات بصرية (opacity + rotate)
- ✅ إعادة ترتيب الأعمدة

### 3. التمرير:
- ✅ أفقي على الجوال
- ✅ تلقائي عند السحب قرب الحافة

### 4. الخط الأزرق:
- ✅ `h-0.5 md:h-1` للأفقي
- ✅ `w-0.5 md:w-1` للعمودي
- ✅ `bg-blue-500`
- ✅ `shadow-lg shadow-blue-500/50`
- ✅ `rounded-full`
- ✅ `z-50`

---

**انتهى البرومبت - نفذ كل شيء حرفياً كما هو بدون إضافة أو تحسين** ✅
