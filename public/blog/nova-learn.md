---
date: 2026-08-01
industry: education
titleVi: Nova Learn — Chấm bài viết tay bằng AI 
titleEn: Nova Learn — Grades handwriting line by line with AI
descriptionVi: Chấm bài viết tay bằng AI nghe có vẻ đơn giản cho đến khi giáo viên cần biết học sinh sai ở dòng nào, vì sao sai và nên học lại điều gì. Đây là cách Nova Learn giải quyết bài toán đó.
descriptionEn: AI handwriting grading sounds simple until teachers need to know exactly where a student went wrong, why they went wrong, and what they should learn next. Here's how we built Nova Learn to solve that problem.
---

Chấm một bài tự luận bằng AI không khó.

Chấm nó theo cách một giáo viên thực sự có thể sử dụng — từng ý, từng dòng, theo đúng rubric, với khả năng sửa những chỗ AI đọc sai — mới là bài toán khó.

Đó là vấn đề chúng tôi gặp khi xây dựng **Nova Learn**.

Thay vì xây dựng một hệ thống chỉ nhìn vào toàn bộ câu trả lời và đưa ra một điểm số cuối cùng, chúng tôi muốn AI có thể đi theo chính cấu trúc mà giáo viên dùng để chấm bài: học sinh đã làm đúng ý nào, thiếu ý nào, sai ở đâu và từ những lỗi đó có thể luyện tập gì tiếp theo.

Bài viết này là câu chuyện về cách chúng tôi xây dựng hệ thống đó.

## Bài toán không phải là chấm điểm. Bài toán là hiểu học sinh sai ở đâu.

Trong một bài tự luận, điểm số cuối cùng chỉ là kết quả.

Điều giáo viên thực sự cần biết là:

> Học sinh mất điểm ở đâu?

Một câu trả lời có thể chứa nhiều ý nhỏ. Trong một câu hỏi sinh học, chẳng hạn, rubric có thể yêu cầu học sinh xác định enzyme, mô tả quá trình và giải thích kết quả. Học sinh có thể làm đúng hai ý nhưng bỏ sót ý thứ ba.

Nếu toàn bộ câu trả lời được đưa vào một mô hình và nhận về `7/10`, hệ thống đã trả lời được câu hỏi “học sinh được bao nhiêu điểm”, nhưng chưa trả lời được câu hỏi quan trọng hơn:

**“Học sinh cần học lại điều gì?”**

Đó là lý do chúng tôi không bắt đầu bằng một hệ thống chấm điểm.

Chúng tôi bắt đầu từ rubric.

## Từ rubric đến từng dòng trong bài làm

Nova Learn coi rubric là cấu trúc chính của quá trình chấm.

Thay vì:

```text
Ảnh bài làm
    ↓
OCR toàn bộ
    ↓
AI chấm
    ↓
7/10
```

pipeline được thiết kế theo hướng:

```text
Ảnh bài làm
    ↓
Xác định câu hỏi và vùng trả lời
    ↓
OCR từng vùng / từng dòng
    ↓
Đối chiếu với từng rubric point
    ↓
Điểm + nhận xét cho từng ý
    ↓
Giáo viên xác nhận
```

Sự khác biệt nằm ở bước cuối cùng của pipeline.

Chúng tôi không muốn AI trở thành một “black box” trả về một con số.

AI cần đưa ra một kết quả mà giáo viên có thể **nhìn thấy, kiểm tra và chỉnh sửa**.

## OCR bài viết tay là phần khó hơn chúng tôi nghĩ

OCR trên văn bản in khá dễ.

OCR trên bài viết tay của học sinh trung học là một câu chuyện khác.

Chữ viết có thể nghiêng, khoảng cách giữa các dòng không đều, câu trả lời có thể nằm ngoài vùng dự kiến hoặc một dòng có thể được viết tiếp ở một vị trí khác trên trang.

Nếu OCR đọc sai một từ, vấn đề không chỉ nằm ở OCR.

Nó có thể kéo theo:

- nội dung câu trả lời bị hiểu sai;
- rubric matching sai;
- điểm số sai;
- và cuối cùng là feedback sai cho học sinh.

Vì vậy, chúng tôi không cố gắng loại bỏ con người khỏi pipeline.

Chúng tôi thiết kế pipeline để **con người có thể can thiệp đúng lúc**.

## Human-in-the-loop không phải fallback. Nó là một phần của sản phẩm.

Khi hệ thống xác định vùng chứa câu trả lời, giáo viên có thể xem lại trực tiếp trên bài làm.

Nếu AI xác định sai vùng chữ, giáo viên có thể sử dụng **Fix regions** để vẽ lại vùng cần nhận dạng.

Sau đó hệ thống thực hiện lại quá trình OCR và grading trên vùng đã được hiệu chỉnh.

Quan trọng hơn, điểm số không được công bố cho học sinh ngay khi AI đưa ra kết quả.

Giáo viên vẫn là người xác nhận cuối cùng.

Đây là một quyết định sản phẩm có chủ ý.

Trong giáo dục, một hệ thống có độ chính xác cao nhưng không cho phép giáo viên kiểm soát kết quả vẫn có thể tạo ra vấn đề.

Chúng tôi muốn AI làm phần công việc tốn thời gian nhất.

**Giáo viên vẫn giữ quyền quyết định.**

quiz.png

## Chúng tôi không muốn AI chỉ chấm bài. Chúng tôi muốn nó biết học sinh cần học gì tiếp theo.

Đây là phần bắt đầu trở nên thú vị.

Sau mỗi lần chấm, Nova Learn đã có một dữ liệu rất cụ thể:

- học sinh làm đúng ý nào;
- bỏ sót ý nào;
- sai ở đâu;
- và dạng kiến thức nào đang gây khó khăn.

Thay vì bỏ dữ liệu đó sau khi tính điểm, chúng tôi sử dụng nó làm đầu vào cho bước tiếp theo.

### Từ lỗi sai → bài luyện tập

Giả sử một học sinh trả lời đúng phần lớn câu hỏi nhưng liên tục bỏ sót một khái niệm.

Một hệ thống truyền thống có thể chỉ trả về:

> 7/10

Nova Learn có thể biến chính lỗi đó thành một mục tiêu luyện tập.

Hệ thống tạo quiz dựa trên **khoảng trống kiến thức vừa được phát hiện**, thay vì lấy ngẫu nhiên một câu hỏi từ ngân hàng đề có sẵn.

Điều này thay đổi mục tiêu của hệ thống.

Không còn là:

> “Học sinh được bao nhiêu điểm?”

Mà trở thành:

> “Sau bài kiểm tra này, học sinh nên học gì tiếp theo?”

worksheet.png

## Quiz không phải là phần cuối của feedback loop

Một câu hỏi trắc nghiệm có thể cho biết học sinh đã chọn đúng hay sai.

Nhưng nó chưa chắc giúp học sinh hiểu **tại sao**.

Vì vậy, Nova Learn tạo thêm worked solution cho những nội dung học sinh chưa nắm được.

Chúng tôi sử dụng cấu trúc:

**Nguyên nhân → Quá trình → Kết quả**

Ví dụ, thay vì chỉ đưa cho học sinh một đáp án mẫu về một quá trình sinh học, hệ thống hướng học sinh đi qua từng bước:

- enzyme nào tham gia;
- quá trình nào xảy ra;
- điều gì thay đổi;
- và kết quả cuối cùng là gì.

Mục tiêu không phải để học sinh có thêm một câu trả lời để học thuộc.

Mục tiêu là giúp các em **xây dựng lại cách suy luận dẫn đến câu trả lời đó**.

## Một hệ thống, ba ngôn ngữ

Một bài toán khác xuất hiện khi chúng tôi đưa hệ thống vào môi trường trường học thực tế.

Ngôn ngữ không phải lúc nào cũng cố định.

Một trường có thể dạy một môn bằng tiếng Việt, một môn khác bằng tiếng Anh, hoặc có những lớp sử dụng tiếng Trung.

Nếu chỉ dịch giao diện, bài toán vẫn chưa được giải quyết.

Ngôn ngữ cần được giữ nhất quán xuyên suốt workflow:

```text
Bài làm
   ↓
OCR
   ↓
Grading
   ↓
Feedback
   ↓
Quiz
   ↓
Worked solution
```

Nova Learn hiện hỗ trợ tiếng Việt, tiếng Anh và tiếng Trung trong giao diện, nội dung quiz và hướng dẫn giải.

Điều quan trọng không phải là “hỗ trợ ba ngôn ngữ”.

Điều quan trọng là **ngôn ngữ của quá trình học không bị đứt gãy giữa các bước**.

## Điều chúng tôi học được khi xây dựng hệ thống

Xây dựng AI cho giáo dục nhanh chóng cho chúng tôi thấy một điều:

**AI accuracy không phải lúc nào cũng là metric quan trọng nhất.**

Một hệ thống có thể rất tốt trên một benchmark nhưng vẫn khó sử dụng trong lớp học nếu giáo viên không hiểu nó đang làm gì.

Vì vậy, một số quyết định quan trọng nhất của Nova Learn không nằm ở model.

Chúng nằm ở product design:

- Chia grading theo rubric thay vì một điểm tổng.
- Cho phép giáo viên sửa vùng OCR.
- Không tự động công bố điểm khi chưa được xác nhận.
- Lưu lại các điểm yếu sau mỗi lần chấm.
- Dùng chính các điểm yếu đó để tạo nội dung luyện tập tiếp theo.

Mỗi quyết định đều hướng tới cùng một mục tiêu:

> **AI không thay thế giáo viên. AI loại bỏ phần công việc lặp lại để giáo viên có nhiều thời gian hơn cho việc dạy.**

## Từ một bài kiểm tra đến một vòng lặp học tập

Đó cũng là cách chúng tôi nhìn Nova Learn.

Không phải:

```text
Student
   ↓
Test
   ↓
Score
```

Mà là:

```text
Student
   ↓
Handwritten answer
   ↓
AI grading
   ↓
Teacher review
   ↓
Learning gaps
   ↓
Personalized quiz
   ↓
Worked solution
   ↓
Practice
   ↓
Next assessment
```

Một bài kiểm tra vì thế không còn là điểm kết thúc.

Nó trở thành dữ liệu đầu vào cho **vòng lặp học tập tiếp theo**.

Và đó là phần chúng tôi tin rằng AI có thể tạo ra giá trị thực sự trong giáo dục: không chỉ chấm nhanh hơn, mà giúp biến mỗi lần làm bài thành một cơ hội để hiểu học sinh đang ở đâu và nên đi đâu tiếp theo.

<!-- en -->

Grading an essay with AI is not particularly difficult.

Grading it in a way that a real teacher can trust — point by point, line by line, against the actual rubric, with the ability to correct the system when it gets something wrong — is a very different problem.

That was the challenge we faced while building **Nova Learn**.

Instead of building another system that reads an answer sheet and returns a final score, we wanted AI to follow the same structure teachers use when grading: which points a student got right, which ones were missing, where the answer went wrong, and what the student should practice next.

This is the story of how we built it.

## The problem isn't grading. It's understanding where the student went wrong.

A final score is only an outcome.

What teachers actually need to know is:

> Where did the student lose the points?

A single answer can contain several distinct concepts. In a biology question, for example, a rubric might ask a student to identify an enzyme, describe a process, and explain the resulting change.

A student might get two of those right and miss the third.

If we send the entire answer to a model and get back `7/10`, we've answered one question:

**How much did the student score?**

We haven't answered the more important one:

**What does the student need to learn next?**

That's why we didn't start by building a scoring system.

We started with the rubric.

## Turning a rubric into line-level grading

Nova Learn treats the rubric as the backbone of the grading process.

Instead of:

```text
Answer sheet
    ↓
OCR everything
    ↓
AI grading
    ↓
7/10
```

the pipeline looks more like:

```text
Answer sheet
    ↓
Detect question and answer regions
    ↓
OCR each relevant line
    ↓
Match against each rubric point
    ↓
Per-point score + feedback
    ↓
Teacher review
```

The difference is important.

We don't want AI to behave like a black box that produces a number.

We want it to produce a result that a teacher can **inspect, understand, and correct**.

## Handwriting OCR turned out to be harder than expected

OCR on printed text is relatively straightforward.

Handwritten answers from secondary-school students are not.

Writing can be slanted. Lines can be unevenly spaced. Students can write outside the expected area or continue an answer somewhere else on the page.

If OCR gets one word wrong, the problem doesn't stop at OCR.

It can affect:

- the extracted answer;
- rubric matching;
- the score;
- and ultimately the feedback shown to the student.

So instead of trying to remove humans from the pipeline, we designed the pipeline so that **humans can intervene at the right moment**.

## Human-in-the-loop isn't a fallback. It's part of the product.

When Nova Learn detects answer regions, teachers can review them directly on the original paper.

If the system misses a line or selects the wrong area, the teacher can use **Fix regions** to redraw the region manually.

The system then reruns OCR and grading against the corrected region.

More importantly, AI doesn't get the final say.

Marks are not released to students until a teacher reviews and confirms them.

That boundary is intentional.

In education, a highly accurate system that gives teachers no control over its decisions can still create problems.

We want AI to handle the most repetitive part of the workflow.

**The teacher keeps the final decision.**

quiz.png

## We didn't want AI to just grade the paper. We wanted it to understand what the student should learn next.

This is where the system becomes more interesting.

After every grading session, Nova Learn has something much more valuable than a score.

It knows:

- which points the student understood;
- which points were missing;
- where the answer went wrong;
- and which concepts appear to be causing difficulty.

Instead of discarding that information after grading, we use it as the input for the next step.

### From mistakes to targeted practice

Suppose a student gets most of a question right but repeatedly misses one particular concept.

A traditional grading system might simply return:

> 7/10

Nova Learn turns that specific gap into a practice target.

The system generates multiple-choice questions from the **knowledge gaps identified during grading**, rather than randomly selecting questions from a predefined bank.

The goal changes from:

> “What score did the student get?”

to:

> “What should this student practice next?”

worksheet.png

## A quiz isn't the end of the feedback loop

A multiple-choice question can tell us whether a student got something right or wrong.

It doesn't necessarily tell the student why.

That's why Nova Learn also generates worked solutions for the concepts a student struggled with.

We structure these explanations around:

**Cause → Process → Result**

For a biology question, for example, the system can guide the student through:

- which enzyme is involved;
- what process takes place;
- what changes during that process;
- and what the final outcome is.

The goal isn't to give students another model answer to memorize.

It's to help them **reconstruct the reasoning that leads to the answer**.

## One workflow, three languages

Another challenge emerged when we considered real school environments.

The language of instruction isn't always consistent.

A school might teach one subject in Vietnamese, another in English, and another in Chinese.

Simply translating the interface doesn't solve the problem.

Language needs to remain consistent across the entire learning workflow:

```text
Answer sheet
   ↓
OCR
   ↓
Grading
   ↓
Feedback
   ↓
Quiz
   ↓
Worked solution
```

Nova Learn supports Vietnamese, English, and Chinese across the interface, generated quizzes, and worked solutions.

The important part isn't simply supporting three languages.

It's keeping the **learning experience consistent from grading through practice**, regardless of the language being used.

## What building this taught us

Building AI for education quickly taught us something:

**Model accuracy isn't always the most important metric.**

A system can perform extremely well on a benchmark and still be difficult to use in a real classroom if teachers can't understand what it is doing.

That's why some of the most important decisions in Nova Learn aren't about the model at all.

They're product decisions:

- Grade against individual rubric points instead of producing one aggregate score.
- Let teachers correct OCR regions.
- Don't release marks before teacher confirmation.
- Preserve the learning gaps identified during grading.
- Use those gaps to generate targeted practice.

All of these decisions point toward the same principle:

> **AI shouldn't replace the teacher. It should remove repetitive work so teachers can spend more time teaching.**

## From a test to a learning loop

That's ultimately how we think about Nova Learn.

Not:

```text
Student
   ↓
Test
   ↓
Score
```

But:

```text
Student
   ↓
Handwritten answer
   ↓
AI grading
   ↓
Teacher review
   ↓
Learning gaps
   ↓
Personalized quiz
   ↓
Worked solution
   ↓
Practice
   ↓
Next assessment
```

A test is no longer the end of the process.

It becomes input for the **next learning cycle**.

And that's where we believe AI can create real value in education: not simply by grading faster, but by turning every assessment into a clearer picture of where a student is — and what they should learn next.
